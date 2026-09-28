import { RECIPE_ITEMS } from '../constants'

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
}) {
  if (isEditing) {
    return (
      <div className="preset-card preset-card-editing">
        <input
          type="text"
          className="preset-name-input"
          value={draftName}
          onChange={(e) => onDraftNameChange(e.target.value)}
          placeholder={`프리셋 ${index + 1}`}
        />
        <div className="preset-edit-grid">
          {RECIPE_ITEMS.map(({ code }) => (
            <label className="preset-edit-cell" key={code}>
              <span>{code}</span>
              <input
                type="number"
                min="0"
                value={draftValues[code] ?? ''}
                onChange={(e) => onDraftValueChange(code, e.target.value)}
              />
            </label>
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
            {code}:{preset.values[code] ?? 0}
          </span>
        ))}
      </div>
    </div>
  )
}
