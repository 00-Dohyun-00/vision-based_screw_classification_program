import PresetCard from './PresetCard'

export default function PresetGrid({
  presets,
  editingIndex,
  draftName,
  draftValues,
  onApply,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDraftNameChange,
  onDraftValueChange,
}) {
  return (
    <div className="recipe-presets">
      {presets.map((preset, index) => (
        <PresetCard
          key={index}
          preset={preset}
          index={index}
          isEditing={editingIndex === index}
          draftName={draftName}
          draftValues={draftValues}
          onApply={onApply}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onDraftNameChange={onDraftNameChange}
          onDraftValueChange={onDraftValueChange}
        />
      ))}
    </div>
  )
}
