import { useEffect, useState } from 'react'
import { COUNTS_POLL_MS } from '../constants'
import { getCluster } from '../api/visionApi'

// 인식된 군집이 없으면 서버가 204를 준다(api/client.js의 fetchJsonOrEmpty).
// 204는 오류가 아니라 "지금은 군집이 없다"는 정상 상태라서 error가 아닌 empty로 따로 다룬다.
export function useCluster(url, enabled) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('idle') // idle | connecting | open | empty | error

  useEffect(() => {
    if (!enabled || !url) {
      setStatus('idle')
      return
    }

    let stopped = false
    let timer

    async function poll() {
      try {
        const { empty, data: json } = await getCluster(url)
        if (!stopped) {
          setData(empty ? null : json)
          setStatus(empty ? 'empty' : 'open')
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
