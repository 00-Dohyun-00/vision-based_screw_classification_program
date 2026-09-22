import { useEffect, useState } from 'react'
import './App.css'

// 비전 서버가 주는 두 가지:
//   1) 이미 박스/라벨이 그려진 "완성된 영상" 스트림 (MJPEG 등, <img> 태그로 그냥 띄움)
//   2) 못 개수를 알려주는 FastAPI 엔드포인트 (주기적으로 조회)
// 우리 쪽에서는 카메라도, 박스 그리기도, 중복 카운트 방지도 더 이상 할 필요가 없다.
// (그건 이제 비전 서버 쪽 책임)
const VIDEO_STORAGE_KEY = 'screwvision.videoUrl'
const COUNTS_STORAGE_KEY = 'screwvision.countsUrl'

// TODO: 비전 서버 주소가 정해지면 이 기본값을 실제 주소로 바꿔주세요.
const DEFAULT_VIDEO_URL = 'http://localhost:8787/video'
const DEFAULT_COUNTS_URL = 'http://localhost:8787/counts'
const COUNTS_POLL_MS = 1000

// 못 종류별로 구분되는 색상(양품/불량 같은 의미 없이, 순수하게 종류 구분용).
const TYPE_COLORS = ['#5cc8f5', '#3ddc84', '#f5c15c', '#c792ea', '#ff8a65', '#4dd0e1', '#f06292', '#aed581']

function colorForClass(name) {
  if (!name) return '#9fb0c8'
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return TYPE_COLORS[hash % TYPE_COLORS.length]
}

// 고정된 못 종류/규격 체계. 비전 서버의 개수 응답에 이 문자열("카테고리 길이")과
// 정확히 일치하는 키가 있어야 화면에 집계된다.
const NAIL_CATEGORIES = [
  { name: '철재나사못', lengths: ['16mm', '24mm', '32mm', '38mm'] },
  { name: '콘크리트못', lengths: ['28mm', '38mm'] },
  { name: '나사못', lengths: ['12mm', '16mm'] },
]
const KNOWN_CLASSES = new Set(
  NAIL_CATEGORIES.flatMap((c) => c.lengths.map((len) => `${c.name} ${len}`)),
)

function loadUrl(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

function saveUrl(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* ignore */
  }
}

// 비전 서버의 개수 응답 형식이 아직 확정되지 않았으므로, 몇 가지 흔한 형태를
// 최대한 유연하게 해석한다: {total, byType}, {counts:{...}}, 혹은 그냥
// {"철재나사못 16mm": 3, ...} 처럼 평평한 객체.
// TODO: 실제 응답 형식이 확정되면 이 함수를 그에 맞게 단순화해도 됨.
function normalizeCounts(raw) {
  if (!raw || typeof raw !== 'object') return { total: 0, byType: {} }
  const source = raw.byType || raw.counts || raw.by_type || raw
  const byType = {}
  if (source && typeof source === 'object') {
    for (const [k, v] of Object.entries(source)) {
      if (typeof v === 'number' && k !== 'total') byType[k] = v
    }
  }
  const total = typeof raw.total === 'number' ? raw.total : Object.values(byType).reduce((s, v) => s + v, 0)
  return { total, byType }
}

// 개수 엔드포인트를 주기적으로 조회(polling)한다. WebSocket을 쓸 정도로 자주
// 안 바뀌는 값이라 REST 폴링으로 충분하고 구현/디버깅이 훨씬 단순하다.
function useCounts(url, enabled) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('idle') // idle | connecting | open | error

  useEffect(() => {
    if (!enabled || !url) {
      setStatus('idle')
      return
    }

    let stopped = false
    let timer

    async function poll() {
      try {
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) throw new Error(String(res.status))
        const json = await res.json()
        if (!stopped) {
          setData(json)
          setStatus('open')
        }
      } catch {
        if (!stopped) setStatus('error')
      }
      if (!stopped) timer = setTimeout(poll, COUNTS_POLL_MS)
    }

    setStatus('connecting')
    poll()

    return () => {
      stopped = true
      clearTimeout(timer)
    }
  }, [url, enabled])

  return { data, status }
}

export default function App() {
  const [videoUrl, setVideoUrl] = useState(() => loadUrl(VIDEO_STORAGE_KEY, DEFAULT_VIDEO_URL))
  const [videoUrlInput, setVideoUrlInput] = useState(videoUrl)
  const [videoStatus, setVideoStatus] = useState('idle') // idle | connecting | running | error
  const [videoReloadTick, setVideoReloadTick] = useState(0)

  const [countsUrl, setCountsUrl] = useState(() => loadUrl(COUNTS_STORAGE_KEY, DEFAULT_COUNTS_URL))
  const [countsUrlInput, setCountsUrlInput] = useState(countsUrl)

  const { data: countsData, status: countsStatus } = useCounts(countsUrl, true)
  const { total, byType } = normalizeCounts(countsData)

  const otherCount = Object.entries(byType).reduce(
    (sum, [cls, count]) => sum + (KNOWN_CLASSES.has(cls) ? 0 : count),
    0,
  )

  useEffect(() => {
    setVideoStatus(videoUrl ? 'connecting' : 'idle')
  }, [videoUrl, videoReloadTick])

  function applyVideoUrl() {
    setVideoUrl(videoUrlInput)
    saveUrl(VIDEO_STORAGE_KEY, videoUrlInput)
    setVideoReloadTick((t) => t + 1)
  }

  function applyCountsUrl() {
    setCountsUrl(countsUrlInput)
    saveUrl(COUNTS_STORAGE_KEY, countsUrlInput)
  }

  const videoSrc = videoUrl ? `${videoUrl}${videoUrl.includes('?') ? '&' : '?'}_r=${videoReloadTick}` : ''

  const videoStatusLabel =
    { idle: '대기', connecting: '연결 중...', running: '연결됨', error: '오류' }[videoStatus] || videoStatus
  const countsStatusLabel =
    { idle: '대기', connecting: '연결 중...', open: '연결됨', error: '오류' }[countsStatus] || countsStatus

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" />
          SCREW VISION CLASSIFIER
        </div>
        <div className="topbar-status">
          <span className={`status-pill ${videoStatus}`}>영상: {videoStatusLabel}</span>
          <span className={`status-pill ${countsStatus}`}>개수 서버: {countsStatusLabel}</span>
          <span className="clock">{new Date().toLocaleDateString('ko-KR')}</span>
        </div>
      </header>

      <div className="source-bar">
        <span className="source-bar-label">영상 스트림</span>
        <div className="source-phone-input">
          <input
            type="text"
            placeholder={DEFAULT_VIDEO_URL}
            value={videoUrlInput}
            onChange={(e) => setVideoUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyVideoUrl()}
          />
          <button onClick={applyVideoUrl}>연결</button>
          <span className="source-hint">박스 그려서 주는 영상 주소</span>
        </div>
      </div>

      <div className="source-bar">
        <span className="source-bar-label">개수 서버</span>
        <div className="source-phone-input">
          <input
            type="text"
            placeholder={DEFAULT_COUNTS_URL}
            value={countsUrlInput}
            onChange={(e) => setCountsUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyCountsUrl()}
          />
          <button onClick={applyCountsUrl}>연결</button>
          <span className="source-hint">{COUNTS_POLL_MS}ms마다 자동으로 다시 조회합니다</span>
        </div>
      </div>

      <main className="main">
        <section className="video-panel">
          <div className="video-frame">
            {videoUrl ? (
              <img
                key={videoReloadTick}
                src={videoSrc}
                alt="비전 서버 영상"
                className="video-el"
                onLoad={() => setVideoStatus('running')}
                onError={() => setVideoStatus('error')}
              />
            ) : (
              <div className="video-fallback">
                <p>영상 스트림 주소 대기</p>
                <p className="video-fallback-msg">위 입력창에 비전 서버의 영상 주소를 입력해주세요.</p>
              </div>
            )}
          </div>
        </section>

        <aside className="data-panel">
          <div className="card type-counts">
            <h2>못 종류별 개수</h2>
            <div className="type-total">
              총 <strong>{total}</strong>개
            </div>
            {NAIL_CATEGORIES.map((cat) => (
              <div className="type-group" key={cat.name}>
                <div className="type-group-title">{cat.name}</div>
                <ul className="type-list">
                  {cat.lengths.map((len) => {
                    const cls = `${cat.name} ${len}`
                    const count = byType[cls] || 0
                    return (
                      <li key={cls}>
                        <span className="type-dot" style={{ background: colorForClass(cls) }} />
                        <span className="type-name">{len}</span>
                        <span className="type-count">{count}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
            {otherCount > 0 && (
              <div className="type-group">
                <div className="type-group-title">기타 (알 수 없는 종류명)</div>
                <ul className="type-list">
                  <li>
                    <span className="type-dot" style={{ background: '#6b7a94' }} />
                    <span className="type-name">미분류</span>
                    <span className="type-count">{otherCount}</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  )
}
