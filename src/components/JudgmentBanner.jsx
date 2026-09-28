// 상단 OK/NG 판정 배너. 오른쪽에 지금 서버에 반영된 레시피가 어느 프리셋인지 표시한다.
// (왼쪽에 똑같은 텍스트를 안 보이게 하나 더 넣어서, OK/NG 글자가 항상 배너 정중앙에 오게 함)
export default function JudgmentBanner({ judgment, presetName }) {
  const label = presetName || '레시피 미지정'

  return (
    <div className={`judgment-banner ${judgment || 'unknown'}`}>
      <span className="judgment-preset judgment-preset-spacer" aria-hidden="true">
        {label}
      </span>
      <span className="judgment-label">{judgment === 'ok' ? 'OK' : judgment === 'ng' ? 'NG' : '판정 대기'}</span>
      <span className="judgment-preset">{label}</span>
    </div>
  )
}
