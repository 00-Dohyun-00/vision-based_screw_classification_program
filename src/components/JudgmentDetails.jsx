// 항상 떠 있는 상태 줄: 왼쪽엔 OK/NG(또는 판정 대기), 가운데엔 3가지 목록을 하나로 묶어서 보여준다.
//   1) 군집에서 제거 - 군집에 레시피보다 많음
//   2) 군집에 추가   - 군집에 레시피보다 적음
//   3) 트레이에 추가 - 화면 전체 개수가 레시피보다 적음(그 종류 자체가 부족)
// 칸은 항상 보이고, 내용(칩)이 없을 때만 비워둔다.
export default function JudgmentDetails({ judgment, toRemove, toAddToCluster, toRestock }) {
  const label = judgment === 'ok' ? 'OK' : judgment === 'ng' ? 'NG' : '판정 대기'

  return (
    <div className={`judgment-details ${judgment || 'unknown'}`}>
      <span className="judgment-details-status">{label}</span>

      <div className="judgment-detail-list">
        <div className="judgment-detail-group remove">
          <div className="judgment-detail-title">군집에서 제거</div>
          <div className="judgment-detail-chips">
            {toRemove.map((item) => (
              <span className="judgment-detail-chip" key={item.code}>
                {item.code} -{item.count}
              </span>
            ))}
          </div>
        </div>

        <div className="judgment-detail-group add">
          <div className="judgment-detail-title">군집에 추가</div>
          <div className="judgment-detail-chips">
            {toAddToCluster.map((item) => (
              <span className="judgment-detail-chip" key={item.code}>
                {item.code} +{item.count}
              </span>
            ))}
          </div>
        </div>

        <div className="judgment-detail-group restock">
          <div className="judgment-detail-title">트레이에 추가</div>
          <div className="judgment-detail-chips">
            {toRestock.map((item) => (
              <span className="judgment-detail-chip" key={item.code}>
                {item.code} +{item.count}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
