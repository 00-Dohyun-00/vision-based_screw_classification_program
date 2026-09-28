import { useEffect, useState } from 'react'
import { COUNTS_POLL_MS } from '../constants'

// 개수 엔드포인트를 주기적으로 조회(polling)한다. WebSocket을 쓸 정도로 자주
// 안 바뀌는 값이라 REST 폴링으로 충분하고 구현/디버깅이 훨씬 단순하다.
export function useCounts(url, enabled) {
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
