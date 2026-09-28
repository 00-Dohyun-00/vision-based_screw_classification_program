import { RECIPE_ITEMS } from '../constants'
import PresetGrid from './PresetGrid'

export default function RecipeCard({
  recipeUrl,
  recipeInputs,
  onInputChange,
  onApplyRecipe,
  saveStatus,
  loadStatus,
  presets,
  editingPresetIndex,
  draftPresetName,
  draftPresetValues,
  onApplyPreset,
  onStartEditPreset,
  onCancelEditPreset,
  onSaveEditPreset,
  onDraftPresetNameChange,
  onDraftPresetValueChange,
}) {
  return (
    <div className="card recipe-card">
      <h2>부품 설정 (레시피)</h2>
      <div className="recipe-grid">
        {RECIPE_ITEMS.map(({ code, len }) => (
          <div className="recipe-cell" key={code}>
            <span className="recipe-code">{code}</span>
            <span className="recipe-len">{len}</span>
            <input
              type="number"
              min="0"
              value={recipeInputs[code] ?? ''}
              onChange={(e) => onInputChange(code, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button className="recipe-apply" onClick={onApplyRecipe} disabled={!recipeUrl || saveStatus === 'saving'}>
        {saveStatus === 'saving' ? '전송 중...' : '확인'}
      </button>
      {saveStatus === 'saved' && <div className="recipe-status ok">서버에 반영됨</div>}
      {saveStatus === 'error' && <div className="recipe-status error">전송 실패</div>}
      {loadStatus === 'error' && (
        <div className="recipe-status error">현재 레시피를 불러오지 못했습니다 (기본값 0으로 시작)</div>
      )}

      <PresetGrid
        presets={presets}
        editingIndex={editingPresetIndex}
        draftName={draftPresetName}
        draftValues={draftPresetValues}
        onApply={onApplyPreset}
        onStartEdit={onStartEditPreset}
        onCancelEdit={onCancelEditPreset}
        onSaveEdit={onSaveEditPreset}
        onDraftNameChange={onDraftPresetNameChange}
        onDraftValueChange={onDraftPresetValueChange}
      />
    </div>
  )
}
