// 비전 서버 엔드포인트 하나하나에 대응하는 함수들. 실제 요청 방식(GET/PUT, 204 처리 등)은
// client.js가 담당하고, 여기서는 "어떤 엔드포인트를 어떻게 부르는지"만 정리한다.
import { fetchJson, fetchJsonOrEmpty, putJson } from './client'

// GET /api/v1/counts -> {"S16": 3, "C28": 5, ...}
// 현재 화면에 존재하는 모든 못의 종류별 개수.
export function getCounts(url) {
  return fetchJson(url)
}

// GET /api/v1/kits-possible -> {"kits_possible": 2}
// 현재 설정된 레시피 기준으로, 지금 화면의 못으로 만들 수 있는 레시피(세트) 수.
export function getKitsPossible(url) {
  return fetchJson(url)
}

// GET /api/v1/cluster -> 200 + {"S16": 2, ...}, 인식된 군집이 없으면 204.
// 작업 군집(하나로 묶인 못 무더기)의 종류별 개수.
export function getCluster(url) {
  return fetchJsonOrEmpty(url)
}

// GET /api/v1/recipe -> {"C28": 0, "S16": 2, ...}
export function getRecipe(url) {
  return fetchJson(url)
}

// PUT /api/v1/recipe (body: GET과 같은 형식) -> 레시피 전체 교체
export function putRecipe(url, values) {
  return putJson(url, values)
}
