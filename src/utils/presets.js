import { PRESETS_STORAGE_KEY, PRESET_COUNT, RECIPE_ITEMS } from '../constants'

export function zeroRecipeValues() {
  const v = {}
  RECIPE_ITEMS.forEach(({ code }) => {
    v[code] = 0
  })
  return v
}

export function defaultPresets() {
  return Array.from({ length: PRESET_COUNT }, (_, i) => ({
    name: `프리셋 ${i + 1}`,
    values: zeroRecipeValues(),
  }))
}

export function loadPresets() {
  try {
    const raw = localStorage.getItem(PRESETS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      // PRESET_COUNT를 나중에 줄였는데 예전에 더 많이 저장해뒀던 경우, 그 개수만큼
      // 잘라서 쓴다 (localStorage에 더 많은 데이터가 있어도 2개만 표시).
      if (Array.isArray(parsed) && parsed.length > 0) return parsed.slice(0, PRESET_COUNT)
    }
  } catch {
    /* ignore */
  }
  return defaultPresets()
}

export function savePresets(presets) {
  try {
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets))
  } catch {
    /* ignore */
  }
}

// 지금 서버에 반영된 값이 프리셋 중 하나와 정확히 같으면 그 이름을 돌려준다.
export function matchPreset(values, presets) {
  const found = presets.find((p) =>
    RECIPE_ITEMS.every(({ code }) => (p.values[code] ?? 0) === Number(values?.[code] ?? 0)),
  )
  return found ? found.name : null
}
