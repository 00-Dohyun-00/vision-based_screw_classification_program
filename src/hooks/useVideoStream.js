import { useEffect, useState } from 'react'
import { VIDEO_RETRY_MS } from '../constants'

// 영상 <img> 상태(연결중/연결됨/오류)를 관리하고, 오류 나면(onError) 사용자가
// 따로 누를 버튼이 없으니 자동으로 재시도한다(reloadTick을 <img key={...}>에 써서
// 강제로 새 엘리먼트를 만들면 브라우저가 다시 연결을 시도한다).
export function useVideoStream(url) {
  const [status, setStatus] = useState('idle') // idle | connecting | running | error
  const [reloadTick, setReloadTick] = useState(0)

  useEffect(() => {
    setStatus(url ? 'connecting' : 'idle')
  }, [url, reloadTick])

  useEffect(() => {
    if (status !== 'error') return
    const timer = setTimeout(() => setReloadTick((t) => t + 1), VIDEO_RETRY_MS)
    return () => clearTimeout(timer)
  }, [status])

  return {
    status,
    reloadTick,
    onLoad: () => setStatus('running'),
    onError: () => setStatus('error'),
  }
}
