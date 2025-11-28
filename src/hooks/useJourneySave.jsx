// hooks/useJourneySave.js
import { useEffect, useRef } from 'react'
import { saveJourneyToDatabase } from '../utils/JourneyStorage'

const SAVE_DEBOUNCE_MS = 1000

export const useJourneySave = (user, journeyData, currentSection, currentStepInSection) => {
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const saveProgress = async () => {
      if (typeof window === 'undefined') return

      const progressData = {
        data: journeyData,
        section: currentSection,
        stepInSection: currentStepInSection,
        lastSaved: new Date().toISOString()
      }

      if (user) {
        await saveJourneyToDatabase(user.id, journeyData, currentSection, currentStepInSection)
        localStorage.setItem(`journey_${user.id}`, JSON.stringify(progressData))
      } else {
        localStorage.setItem('journey_guest', JSON.stringify(progressData))
      }
    }

    const timeoutId = setTimeout(saveProgress, SAVE_DEBOUNCE_MS)
    return () => clearTimeout(timeoutId)
  }, [journeyData, currentSection, currentStepInSection, user])
}