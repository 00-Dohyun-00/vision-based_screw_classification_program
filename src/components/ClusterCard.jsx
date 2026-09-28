import MetricGrid from './MetricGrid'

// 작업 군집(지금 화면에서 하나로 묶인 못 무더기)의 종류별 개수.
// 서버가 군집이 없을 때 204를 주므로(useCluster 참고), 그때는 "없음"으로 표시한다.
export default function ClusterCard({ status, byType }) {
  return (
    <div className="card cluster-card">
      <h2>작업 군집</h2>
      {status === 'empty' ? <div className="cluster-empty">인식된 군집 없음</div> : <MetricGrid byType={byType} />}
    </div>
  )
}
