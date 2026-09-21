import { useEffect } from 'react'
import { saveJourneyToDatabase } from '@/utils/JourneyStorage'

const SAVE_DEBOUNCE_MS = 1000

/**
 * Debounced auto-save of journey progress. Logged-in users save to Convex,
 * guests save to localStorage (migrated to Convex on signup).
 *
 * `enabled` must stay false until the caller has finished loading saved
 * progress — otherwise the initial empty state would overwrite it.
 */
export const useJourneySave = ({ user, journeyData, currentSection, currentStepInSection, enabled }) => {
  useEffect(() => {
    if (!enabled) return

    const save = () => {
      if (user) {
        saveJourneyToDatabase(journeyData, currentSection, currentStepInSection)
      } else {
        localStorage.setItem('journey_guest', JSON.stringify({
          data: journeyData,
          section: currentSection,
          stepInSection: currentStepInSection,
          lastSaved: new Date().toISOString(),
        }))
      }
    }

    let timeoutId = setTimeout(() => {
      timeoutId = null
      save()
    }, SAVE_DEBOUNCE_MS)

    // Don't lose the last change if the tab closes before the debounce fires
    const flush = () => {
      if (timeoutId === null) return
      clearTimeout(timeoutId)
      timeoutId = null
      save()
    }
    window.addEventListener('pagehide', flush)

    return () => {
      if (timeoutId !== null) clearTimeout(timeoutId)
      window.removeEventListener('pagehide', flush)
    }
  }, [enabled, journeyData, currentSection, currentStepInSection, user])
}
