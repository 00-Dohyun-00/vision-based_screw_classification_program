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

// 상단 판정 배지(OK/NG)에 쓸 값.
// TODO: /counts가 /recipe와 같은 순수 {code: 개수} 형태로만 오는 걸로 확인되어,
// status 같은 필드는 안 온다. 지금은 이 함수가 아무것도 못 찾아 계속 "판정 대기"로
// 남는다 - OK/NG를 어디서 가져올지(별도 필드 요청 vs 개수/레시피 비교로 직접 계산)
// 정해지면 이 함수를 그에 맞게 채워야 한다.
export function normalizeJudgment(raw) {
  if (!raw || typeof raw !== 'object') return null
  const v = raw.status ?? raw.judgment ?? raw.result
  if (typeof v === 'string') {
    const upper = v.toUpperCase()
    if (['OK', 'PASS', 'GOOD', '양품'].includes(upper)) return 'ok'
    if (['NG', 'FAIL', 'BAD', '불량'].includes(upper)) return 'ng'
  }
  if (typeof raw.ok === 'boolean') return raw.ok ? 'ok' : 'ng'
  return null
}
