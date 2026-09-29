import { RECIPE_ITEMS } from '../constants'
import QuantityInput from './QuantityInput'

// 프리셋 카드 하나. 평소엔 이름+값 미리보기를 보여주고 클릭하면 레시피 입력창에 적용,
// ✎ 누르면 편집 모드(이름/값 직접 수정 + 저장/취소)로 바뀐다.
export default function PresetCard({
  preset,
  index,
  isEditing,
  draftName,
  draftValues,
  onApply,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDraftNameChange,
  onDraftValueChange,
  onResetDraft,
}) {
  if (isEditing) {
    return (
      <div className="preset-card preset-card-editing">
        <div className="preset-header">
          <input
            type="text"
            className="preset-name-input"
            value={draftName}
            onChange={(e) => onDraftNameChange(e.target.value)}
            placeholder={`프리셋 ${index + 1}`}
          />
          <button type="button" className="preset-reset-btn" onClick={onResetDraft}>
            초기화
          </button>
        </div>
        <div className="preset-edit-grid">
          {RECIPE_ITEMS.map(({ code }) => (
            <div className="preset-edit-cell" key={code}>
              <span>{code}</span>
              <QuantityInput
                label={`${draftName || preset.name} ${code}`}
                value={draftValues[code] ?? ''}
                onChange={(value) => onDraftValueChange(code, value)}
              />
            </div>
          ))}
        </div>
        <div className="preset-edit-actions">
          <button type="button" onClick={onSaveEdit}>
            저장
          </button>
          <button type="button" onClick={onCancelEdit}>
            취소
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="preset-card" onClick={() => onApply(preset.values)}>
      <div className="preset-header">
        <div className="preset-name">{preset.name}</div>
        <button
          type="button"
          className="preset-edit-btn"
          title="이 프리셋 편집"
          onClick={(e) => {
            e.stopPropagation()
            onStartEdit(index)
          }}
        >
          ✎
        </button>
      </div>
      <div className="preset-values">
        {RECIPE_ITEMS.map(({ code }) => (
          <span className="preset-chip" key={code}>
            {code}:<span className="preset-chip-value">{preset.values[code] ?? 0}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
