import { RECIPE_ITEMS } from '../constants'
import { colorForClass } from '../utils/colors'

// 못 종류별 개수/작업 군집 카드가 공용으로 쓰는 2x4 표. 셀 하나에 "코드 + 개수"를
// 크고 또렷하게 보여준다(칩으로 촘촘히 나열하던 이전 버전은 가시성이 안 좋았음).
export default function MetricGrid({ byType }) {
  return (
    <div className="metric-grid">
      {RECIPE_ITEMS.map(({ code }) => (
        <div className="metric-cell" key={code}>
          <span className="metric-dot" style={{ background: colorForClass(code) }} />
          <span className="metric-code">{code}</span>
          <span className="metric-value">{String(byType[code] || 0).padStart(2, '0')}</span>
          <span className="metric-unit">개</span>
        </div>
      ))}
    </div>
  )
}
