// 서버와 통신하는 가장 기본적인 형태들. 여기서 fetch()를 직접 다루고,
// 위(hooks)에서는 "무엇을 부를지"만 신경 쓰면 되게 한다.

// GET해서 JSON으로 받는다. 실패하면(네트워크 오류, 4xx/5xx) 에러를 던진다.
export async function fetchJson(url) {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(String(res.status))
  return res.json()
}

// GET인데 204(본문 없음)를 "정상적으로 데이터가 없는 상태"로 다룬다.
// (예: 지금은 인식된 게 없을 때 204를 주는 엔드포인트)
export async function fetchJsonOrEmpty(url) {
  const res = await fetch(url, { cache: 'no-store' })
  if (res.status === 204) return { empty: true, data: null }
  if (!res.ok) throw new Error(String(res.status))
  return { empty: false, data: await res.json() }
}

// JSON body를 PUT으로 보낸다.
export async function putJson(url, body) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(String(res.status))
}
