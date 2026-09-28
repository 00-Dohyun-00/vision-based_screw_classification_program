import { NAIL_CATEGORIES } from '../constants'
import { colorForClass } from '../utils/colors'

// 지금은 SHOW_TYPE_COUNTS 플래그로 화면에서 숨겨져 있는 카드. (constants.js 참고)
export default function TypeCountsCard({ total, byType, otherCount }) {
  return (
    <div className="card type-counts">
      <h2>못 종류별 개수</h2>
      <div className="type-total">
        총 <strong>{total}</strong>개
      </div>
      {NAIL_CATEGORIES.map((cat) => (
        <div className="type-group" key={cat.name}>
          <div className="type-group-title">{cat.name}</div>
          <ul className="type-list">
            {cat.lengths.map((len) => {
              const code = `${cat.code}${len.replace('mm', '')}`
              const count = byType[code] || 0
              return (
                <li key={code}>
                  <span className="type-dot" style={{ background: colorForClass(code) }} />
                  <span className="type-name">{len}</span>
                  <span className="type-count">{count}</span>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
      {otherCount > 0 && (
        <div className="type-group">
          <div className="type-group-title">기타 (알 수 없는 종류명)</div>
          <ul className="type-list">
            <li>
              <span className="type-dot" style={{ background: '#6b7a94' }} />
              <span className="type-name">미분류</span>
              <span className="type-count">{otherCount}</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
