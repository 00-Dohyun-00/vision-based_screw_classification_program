import { useState } from 'react'
import { RECIPE_ITEMS } from '../constants'
import { loadPresets, savePresets } from '../utils/presets'

// 프리셋 값과, 편집 모드(어느 카드가 지금 편집 중인지 + 입력 중인 초안 값)를 관리한다.
export function usePresets() {
  const [presets, setPresets] = useState(() => loadPresets())
  const [editingIndex, setEditingIndex] = useState(null) // null | 0~3
  const [draftName, setDraftName] = useState('')
  const [draftValues, setDraftValues] = useState({})

  function startEdit(index) {
    setEditingIndex(index)
    setDraftName(presets[index].name)
    const dv = {}
    RECIPE_ITEMS.forEach(({ code }) => {
      dv[code] = String(presets[index].values[code] ?? 0)
    })
    setDraftValues(dv)
  }

  function setDraftValue(code, value) {
    setDraftValues((prev) => ({ ...prev, [code]: value }))
  }

  function cancelEdit() {
    setEditingIndex(null)
  }

  function saveEdit() {
    const newValues = {}
    RECIPE_ITEMS.forEach(({ code }) => {
      const n = parseInt(draftValues[code], 10)
      newValues[code] = Number.isFinite(n) && n >= 0 ? n : 0
    })
    const newName = draftName.trim() || presets[editingIndex].name
    setPresets((prev) => {
      const next = prev.map((p, i) => (i === editingIndex ? { name: newName, values: newValues } : p))
      savePresets(next)
      return next
    })
    setEditingIndex(null)
  }

  function resetDraftPreset() {
    if (editingIndex === null) return
    setDraftName(`프리셋 ${editingIndex + 1}`)
    setDraftValues(Object.fromEntries(RECIPE_ITEMS.map(({ code }) => [code, '0'])))
  }

  return {
    presets,
    editingIndex,
    draftName,
    draftValues,
    setDraftName,
    setDraftValue,
    startEdit,
    cancelEdit,
    saveEdit,
    resetDraftPreset,
  }
}
