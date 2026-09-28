import MetricGrid from './MetricGrid'

// /api/v1/counts: 현재 화면에 존재하는 모든 못의 종류별 개수.
export default function TypeCountsCard({ total, byType, otherCount }) {
  return (
    <div className="card type-counts">
      <div className="card-header-row">
        <h2>못 종류별 개수</h2>
        <span className="type-total">
          총 <strong>{total}</strong>개
        </span>
      </div>
      <MetricGrid byType={byType} />
      {otherCount > 0 && <div className="metric-extra">기타(알 수 없는 종류) {otherCount}개</div>}
    </div>
  )
}
