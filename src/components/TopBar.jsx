const VIDEO_STATUS_LABELS = { idle: '대기', connecting: '연결 중...', running: '연결됨', error: '오류' }
const COUNTS_STATUS_LABELS = { idle: '대기', connecting: '연결 중...', open: '연결됨', error: '오류' }

export default function TopBar({ videoStatus, countsStatus }) {
  const videoLabel = VIDEO_STATUS_LABELS[videoStatus] || videoStatus
  const countsLabel = COUNTS_STATUS_LABELS[countsStatus] || countsStatus

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-dot" />
        SCREW VISION CLASSIFIER
      </div>
      <div className="topbar-status">
        <span className={`status-pill ${videoStatus}`}>영상: {videoLabel}</span>
        <span className={`status-pill ${countsStatus}`}>서버: {countsLabel}</span>
        <span className="clock">{new Date().toLocaleDateString('ko-KR')}</span>
      </div>
    </header>
  )
}
