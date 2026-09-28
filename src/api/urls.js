import { API_BASE_PATH, VIDEO_PATH } from '../constants'

export function trimSlash(s) {
  return (s || '').replace(/\/+$/, '')
}

// 비전 서버 호스트(예: http://172.20.10.3:8765) 하나로 영상/개수/레시피/군집/
// 조립가능세트 URL을 전부 만든다. 경로(/stream.mjpg, /api/v1/...)는 비전 서버와
// 확인된 고정 계약이라 호스트만 바뀌면 된다.
export function buildServerUrls(host) {
  const base = trimSlash(host)
  if (!base) {
    return { video: undefined, counts: undefined, recipe: undefined, kitsPossible: undefined, cluster: undefined }
  }
  return {
    video: `${base}${VIDEO_PATH}`,
    counts: `${base}${API_BASE_PATH}/counts`,
    recipe: `${base}${API_BASE_PATH}/recipe`,
    kitsPossible: `${base}${API_BASE_PATH}/kits-possible`,
    cluster: `${base}${API_BASE_PATH}/cluster`,
  }
}
