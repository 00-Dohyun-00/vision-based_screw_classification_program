import { useEffect, useState } from 'react'
import './App.css'

import { RECIPE_ITEMS, KNOWN_CLASSES, SHOW_TYPE_COUNTS } from './constants'
import { normalizeCounts, normalizeJudgment } from './utils/normalize'
import { matchPreset } from './utils/presets'
import { useCounts } from './hooks/useCounts'
import { useRecipe } from './hooks/useRecipe'
import { usePresets } from './hooks/usePresets'
import { useVideoStream } from './hooks/useVideoStream'
import { useServerHost } from './hooks/useServerHost'

import TopBar from './components/TopBar'
import ServerHostBar from './components/ServerHostBar'
import JudgmentBanner from './components/JudgmentBanner'
import VideoPanel from './components/VideoPanel'
import RecipeCard from './components/RecipeCard'
import TypeCountsCard from './components/TypeCountsCard'

// 비전 서버가 주는 두 가지:
//   1) 이미 박스/라벨이 그려진 "완성된 영상" 스트림 (MJPEG 등, <img> 태그로 그냥 띄움)
//   2) 못 개수를 알려주는 FastAPI 엔드포인트 (주기적으로 조회)
// 우리 쪽에서는 카메라도, 박스 그리기도, 중복 카운트 방지도 더 이상 할 필요가 없다.
// (그건 이제 비전 서버 쪽 책임)
export default function App() {
  const serverHost = useServerHost()
  const video = useVideoStream(serverHost.urls.video)

  const { data: countsData, status: countsStatus } = useCounts(serverHost.urls.counts, true)
  const { total, byType } = normalizeCounts(countsData)
  const judgment = normalizeJudgment(countsData) // 'ok' | 'ng' | null(아직 판정 없음/연결 안 됨)

  const otherCount = Object.entries(byType).reduce(
    (sum, [cls, count]) => sum + (KNOWN_CLASSES.has(cls) ? 0 : count),
    0,
  )

  const { saved: savedRecipe, loadStatus: recipeLoadStatus, saveStatus: recipeSaveStatus, save: saveRecipe } =
    useRecipe(serverHost.urls.recipe)
  const [recipeInputs, setRecipeInputs] = useState({})
  const [activePresetName, setActivePresetName] = useState(null) // 현재 서버에 반영된 값과 일치하는 프리셋 이름

  const presets = usePresets()

  // 서버에서 레시피를 받아오면(성공/실패 무관) 입력창 값을 채우고, 프리셋과 일치하는지 확인한다.
  useEffect(() => {
    if (recipeLoadStatus !== 'loaded' && recipeLoadStatus !== 'error') return
    const draft = {}
    RECIPE_ITEMS.forEach(({ code }) => {
      draft[code] = String(savedRecipe[code] ?? 0)
    })
    setRecipeInputs(draft)
    setActivePresetName(matchPreset(savedRecipe, presets.presets))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeLoadStatus, savedRecipe])

  function setRecipeInput(code, value) {
    setRecipeInputs((prev) => ({ ...prev, [code]: value }))
  }

  async function applyRecipe() {
    const next = {}
    RECIPE_ITEMS.forEach(({ code }) => {
      const n = parseInt(recipeInputs[code], 10)
      next[code] = Number.isFinite(n) && n >= 0 ? n : 0
    })
    const ok = await saveRecipe(next)
    if (ok) setActivePresetName(matchPreset(next, presets.presets))
  }

  // 프리셋 카드를 클릭하면 입력창만 채운다 - 서버 전송은 "확인"을 눌러야 일어난다.
  function applyPreset(values) {
    const draft = {}
    RECIPE_ITEMS.forEach(({ code }) => {
      draft[code] = String(values[code] ?? 0)
    })
    setRecipeInputs(draft)
  }

  // index.html의 부팅 로딩 화면은 React가 실제로 화면을 그린 뒤에 지운다.
  useEffect(() => {
    document.getElementById('boot-loading')?.remove()
  }, [])

  return (
    <div className="app">
      <TopBar videoStatus={video.status} countsStatus={countsStatus} />
      <ServerHostBar
        input={serverHost.input}
        onInputChange={serverHost.setInput}
        onApply={serverHost.apply}
        onReset={serverHost.reset}
      />
      <JudgmentBanner judgment={judgment} presetName={activePresetName} />

      <main className="main">
        <VideoPanel
          videoUrl={serverHost.urls.video}
          reloadTick={video.reloadTick}
          onLoad={video.onLoad}
          onError={video.onError}
        />

        <aside className="data-panel">
          <RecipeCard
            recipeUrl={serverHost.urls.recipe}
            recipeInputs={recipeInputs}
            onInputChange={setRecipeInput}
            onApplyRecipe={applyRecipe}
            saveStatus={recipeSaveStatus}
            loadStatus={recipeLoadStatus}
            presets={presets.presets}
            editingPresetIndex={presets.editingIndex}
            draftPresetName={presets.draftName}
            draftPresetValues={presets.draftValues}
            onApplyPreset={applyPreset}
            onStartEditPreset={presets.startEdit}
            onCancelEditPreset={presets.cancelEdit}
            onSaveEditPreset={presets.saveEdit}
            onDraftPresetNameChange={presets.setDraftName}
            onDraftPresetValueChange={presets.setDraftValue}
          />

          {SHOW_TYPE_COUNTS && <TypeCountsCard total={total} byType={byType} otherCount={otherCount} />}
        </aside>
      </main>
    </div>
  )
}
