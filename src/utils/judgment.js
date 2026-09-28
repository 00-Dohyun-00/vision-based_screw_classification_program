import { RECIPE_ITEMS } from '../constants'

// 부품 설정(레시피)과 작업 군집의 종류별 개수를 비교해서 OK/NG를 직접 계산한다.
//   recipe:      부품 설정에서 서버에 반영된 목표 수량 (savedRecipe)
//   cluster:     작업 군집의 실제 종류별 개수 (clusterByType)
//   totalCounts: 화면(트레이) 전체의 종류별 개수 (byType)
//
// - ok: 모든 종류에서 군집 개수 == 레시피 목표 수량
// - ng일 때 세 가지 목록:
//   1) toRemove       군집에 레시피보다 많이 있는 것 -> 군집에서 빼야 함
//   2) toAddToCluster 군집에 레시피보다 적게 있는 것 -> 군집에 더 넣어야 함
//   3) toRestock      트레이 전체 개수가 레시피보다 부족한 것 -> 그 종류 자체가 모자람(보충 필요)
export function computeJudgment(recipe, cluster, totalCounts) {
  const toRemove = []
  const toAddToCluster = []
  const toRestock = []
  let ok = true

  RECIPE_ITEMS.forEach(({ code, name, len }) => {
    const target = Number(recipe?.[code] ?? 0)
    const have = Number(cluster?.[code] ?? 0)
    const total = Number(totalCounts?.[code] ?? 0)

    if (have !== target) ok = false

    if (have > target) {
      toRemove.push({ code, name, len, count: have - target })
    } else if (have < target) {
      toAddToCluster.push({ code, name, len, count: target - have })
    }

    if (total < target) {
      toRestock.push({ code, name, len, count: target - total })
    }
  })

  return { ok, toRemove, toAddToCluster, toRestock }
}
