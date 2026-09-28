import { TYPE_COLORS } from '../constants'

// 못 종류별로 구분되는 색상(양품/불량 같은 의미 없이, 순수하게 종류 구분용).
// 클래스 이름 문자열을 해시해서 항상 같은 종류는 같은 색을 쓰도록 한다.
export function colorForClass(name) {
  if (!name) return '#9fb0c8'
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return TYPE_COLORS[hash % TYPE_COLORS.length]
}
