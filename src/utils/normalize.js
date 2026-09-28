// /counts는 /recipe와 같은 형태로 온다고 확인됨: {"S16": 3, "C28": 5, ...} 처럼
// code를 키로 하는 평평한 객체, total/status 같은 부가 필드 없음.
// (혹시 몰라 {total, byType}/{counts:{...}} 래핑 형태도 계속 지원한다.)
export function normalizeCounts(raw) {
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

// /api/v1/kits-possible 응답: {"kits_possible": 2} 형태로 확인됨.
// 혹시 몰라 그냥 숫자로 오거나 count/kits/possible 필드로 와도 인식하게 유연하게 짰다.
export function normalizeKitsPossible(raw) {
  if (typeof raw === 'number') return raw
  if (raw && typeof raw === 'object') {
    const v = raw.kits_possible ?? raw.count ?? raw.kits ?? raw.possible ?? raw.value
    if (typeof v === 'number') return v
  }
  return null
}
