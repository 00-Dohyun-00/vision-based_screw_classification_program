import { useEffect, useState } from 'react'
import { getRecipe, putRecipe } from '../api/visionApi'

// 레시피(못 종류별 목표 개수)를 GET으로 불러오고, PUT으로 전체 교체한다.
export function useRecipe(url) {
  const [saved, setSaved] = useState({})
  const [loadStatus, setLoadStatus] = useState('idle') // idle | loading | loaded | error
  const [saveStatus, setSaveStatus] = useState('idle') // idle | saving | saved | error

  useEffect(() => {
    if (!url) {
      setLoadStatus('idle')
      return
    }
    let stopped = false
    setLoadStatus('loading')
    getRecipe(url)
      .then((json) => {
        if (!stopped) {
          setSaved(json && typeof json === 'object' ? json : {})
          setLoadStatus('loaded')
        }
      })
      .catch(() => {
        if (!stopped) setLoadStatus('error')
      })
    return () => {
      stopped = true
    }
  }, [url])

  async function save(next) {
    if (!url) return false
    setSaveStatus('saving')
    try {
      await putRecipe(url, next)
      setSaved(next)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus((s) => (s === 'saved' ? 'idle' : s)), 2000)
      return true
    } catch {
      setSaveStatus('error')
      return false
    }
  }

  return { saved, loadStatus, saveStatus, save }
}
