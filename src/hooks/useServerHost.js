import { useState } from 'react'
import { DEFAULT_SERVER_HOST, HOST_STORAGE_KEY } from '../constants'
import { buildServerUrls, trimSlash } from '../api/urls'

function loadHost() {
  try {
    return localStorage.getItem(HOST_STORAGE_KEY) || DEFAULT_SERVER_HOST
  } catch {
    return DEFAULT_SERVER_HOST
  }
}

function saveHost(value) {
  try {
    localStorage.setItem(HOST_STORAGE_KEY, value)
  } catch {
    /* ignore */
  }
}

// 비전 서버 호스트 하나만 관리한다.
// 핫스팟/Wi-Fi가 바뀌어 IP가 바뀌면 여기서 이 값만 바꾸면 영상/개수/레시피/군집/
// 조립가능세트 URL이 전부 다시 계산된다(api/urls.js). localStorage에 저장되어
// 앱을 다시 켜도 유지된다.
export function useServerHost() {
  const [host, setHost] = useState(loadHost)
  const [input, setInput] = useState(host)

  function apply() {
    const next = trimSlash(input.trim())
    setHost(next)
    saveHost(next)
  }

  function reset() {
    const next = trimSlash(DEFAULT_SERVER_HOST)
    setInput(next)
    setHost(next)
    saveHost(next)
  }

  return { host, input, setInput, apply, reset, urls: buildServerUrls(host) }
}
