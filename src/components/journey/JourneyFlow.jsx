'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { loadJourneyFromDatabase, deleteJourneyFromDatabase } from '@/utils/JourneyStorage'
import { readGuestJourney, hasAnswers } from '@/utils/guestJourney'
import { useJourneySave } from '@/hooks/useJourneySave'
import JourneySidebar from './JourneySidebar'
import { Menu, X } from 'lucide-react'

import { SECTION_CONFIGS, INITIAL_JOURNEY_DATA, getSectionSteps } from './sections'

const getSection = (id) => SECTION_CONFIGS.find(s => s.id === id)

// Once dismissed, the "save your progress" banner stays gone on this device —
// a soft nudge, not a wall, so "no" means no.
const SAVE_BANNER_DISMISSED_KEY = 'journey_save_banner_dismissed'

const JourneyFlow = () => {
  const { user } = useAuth()

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [journeyData, setJourneyData] = useState(INITIAL_JOURNEY_DATA)
  const [currentSection, setCurrentSection] = useState('welcome')
  const [currentStepInSection, setCurrentStepInSection] = useState(0)
  // Which storage (user id or 'guest') the current journeyData was loaded from.
  // Saving stays disabled until it matches, so an empty initial state never
  // overwrites saved progress.
  const [loadedFrom, setLoadedFrom] = useState(null)
  const [bannerDismissed, setBannerDismissed] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem(SAVE_BANNER_DISMISSED_KEY) === '1'
  )
  const storageKey = user ? user.id : 'guest'
  const mainContentRef = useRef(null)

  // Step components call updateJourneyData() and then nextStep() in the same
  // tick (or after a transition timeout), so nextStep must see the *latest*
  // data rather than the render it was created in. Keep a ref in sync.
  const latest = useRef({ journeyData, currentSection, currentStepInSection })
  useEffect(() => {
    latest.current = { journeyData, currentSection, currentStepInSection }
  }, [journeyData, currentSection, currentStepInSection])

  // Load progress on mount / auth change
  useEffect(() => {
    let cancelled = false
    const applySaved = (data, section, step) => {
      if (cancelled) return
      setJourneyData({ ...INITIAL_JOURNEY_DATA, ...data })
      setCurrentSection(section || 'welcome')
      setCurrentStepInSection(step || 0)
    }

    const loadProgress = async () => {
      if (user) {
        const { success, data } = await loadJourneyFromDatabase()
        if (success && data) applySaved(data.journey_data, data.current_section, data.current_step)
      } else {
        const saved = readGuestJourney()
        if (saved) applySaved(saved.data, saved.section, saved.stepInSection)
      }
      if (!cancelled) setLoadedFrom(storageKey)
    }

    loadProgress()
    return () => { cancelled = true }
  }, [user, storageKey])

  useJourneySave({
    user,
    journeyData,
    currentSection,
    currentStepInSection,
    enabled: loadedFrom === storageKey,
  })

  const scrollToTop = () => {
    setTimeout(() => {
      mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }, 50)
  }

  const handleStartOver = async () => {
    if (user) {
      await deleteJourneyFromDatabase()
    } else {
      localStorage.removeItem('journey_guest')
    }
    setJourneyData(INITIAL_JOURNEY_DATA)
    setCurrentSection('welcome')
    setCurrentStepInSection(0)
    setShowResetConfirm(false)
    scrollToTop()
  }

  const updateJourneyData = useCallback((key, value) => {
    latest.current.journeyData = { ...latest.current.journeyData, [key]: value }
    setJourneyData(prev => ({ ...prev, [key]: value }))
  }, [])

  const dismissSaveBanner = () => {
    localStorage.setItem(SAVE_BANNER_DISMISSED_KEY, '1')
    setBannerDismissed(true)
  }

  const rememberStep = (sectionId, step) => {
    setJourneyData(prev => ({
      ...prev,
      lastStepInSection: { ...prev.lastStepInSection, [sectionId]: step },
    }))
  }

  const goToSection = useCallback((sectionId, stepIndex = null) => {
    const { journeyData } = latest.current
    setCurrentSection(sectionId)
    setCurrentStepInSection(stepIndex ?? journeyData.lastStepInSection?.[sectionId] ?? 0)
    scrollToTop()
  }, [])

  const nextStep = useCallback(() => {
    const { journeyData, currentSection, currentStepInSection } = latest.current
    const section = getSection(currentSection)
    const steps = getSectionSteps(section, journeyData)
    if (!section || steps.length === 0) return

    const isLastStep = currentStepInSection >= steps.length - 1

    setJourneyData(prev => {
      const completed = prev.completedSteps[currentSection] || []
      return {
        ...prev,
        completedSteps: {
          ...prev.completedSteps,
          [currentSection]: completed.includes(currentStepInSection)
            ? completed
            : [...completed, currentStepInSection],
        },
        sectionCompletion: isLastStep
          ? { ...prev.sectionCompletion, [currentSection]: true }
          : prev.sectionCompletion,
      }
    })

    if (!isLastStep) {
      const newStep = currentStepInSection + 1
      setCurrentStepInSection(newStep)
      rememberStep(currentSection, newStep)
    } else {
      rememberStep(currentSection, currentStepInSection)
      const currentIndex = SECTION_CONFIGS.findIndex(s => s.id === currentSection)
      const next = SECTION_CONFIGS[currentIndex + 1]
      if (next) {
        setCurrentSection(next.id)
        setCurrentStepInSection(journeyData.lastStepInSection[next.id] || 0)
      }
    }
    scrollToTop()
  }, [])

  const prevStep = useCallback(() => {
    const { journeyData, currentSection, currentStepInSection } = latest.current
    if (currentStepInSection > 0) {
      const newStep = currentStepInSection - 1
      setCurrentStepInSection(newStep)
      rememberStep(currentSection, newStep)
    } else {
      const currentIndex = SECTION_CONFIGS.findIndex(s => s.id === currentSection)
      const prev = SECTION_CONFIGS[currentIndex - 1]
      if (prev) {
        const prevSteps = getSectionSteps(prev, journeyData)
        setCurrentSection(prev.id)
        setCurrentStepInSection(
          journeyData.lastStepInSection[prev.id] || Math.max(0, prevSteps.length - 1)
        )
      }
    }
    scrollToTop()
  }, [])

  // Lets a step deep-link back to a specific step of another section
  const getStepIndexInSection = useCallback((sectionId, Component) => {
    const section = getSection(sectionId)
    if (!section) return 0
    const index = getSectionSteps(section, latest.current.journeyData)
      .findIndex(step => step.Component === Component)
    return Math.max(index, 0)
  }, [])

  const section = getSection(currentSection)
  const steps = section ? getSectionSteps(section, journeyData) : []
  const StepComponent = steps[currentStepInSection]?.Component
  // Only nudge once there's something real to lose, and never nag a signed-in user
  const showSaveBanner = !user && !bannerDismissed && hasAnswers(journeyData)

  return (
    <>
      <div className="fixed inset-0 overflow-hidden static-background" />
      <div className="fixed top-18 left-0 w-full border-b border-primary-500/40 z-50" />

      {showResetConfirm && (
        <ResetConfirmModal
          onCancel={() => setShowResetConfirm(false)}
          onConfirm={handleStartOver}
        />
      )}

      <div className="min-h-screen relative" style={{ zIndex: 1 }}>
        <div className="pt-18">
          <JourneySidebar
            sections={SECTION_CONFIGS}
            journeyData={journeyData}
            currentSection={currentSection}
            currentStepInSection={currentStepInSection}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onGoToSection={goToSection}
            onStartOver={() => setShowResetConfirm(true)}
          />

          <div className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
            <div ref={mainContentRef} className="h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="px-2 md:px-8 py-2 md:py-8 min-h-full w-full static-background">
                {!isSidebarOpen && (
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Open journey menu"
                    className="absolute md:top-7 bg-zinc-950 shadow-lg p-3 rounded-lg hover:bg-gray-700 transition-transform duration-300 z-50"
                  >
                    <Menu className="w-6 h-6 text-primary-100" />
                  </button>
                )}

                {showSaveBanner && <SaveProgressBanner onDismiss={dismissSaveBanner} />}

                {section?.multipleSteps && steps.length > 1 && (
                  <SectionProgressBar
                    currentStep={currentStepInSection + 1}
                    totalSteps={steps.length}
                    fullWidth={isSidebarOpen}
                  />
                )}

                <div key={`${currentSection}-${currentStepInSection}`} className="fadeInCard">
                  {StepComponent ? (
                    <StepComponent
                      journeyData={journeyData}
                      updateJourneyData={updateJourneyData}
                      nextStep={nextStep}
                      prevStep={prevStep}
                      goToSection={goToSection}
                      getStepIndexInSection={getStepIndexInSection}
                    />
                  ) : (
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                      <p className="text-gray-600">Step not found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const SectionProgressBar = ({ currentStep, totalSteps, fullWidth }) => {
  const progress = (currentStep / totalSteps) * 100
  return (
    <div className={`mb-6 mt-6 md:mt-0 ${fullWidth ? 'w-full' : 'max-w-6xl mx-auto'}`}>
      <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-accent-green-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-2 text-sm text-primary-100">
        <span className="font-medium">Section Progress</span>
        <span>Step {currentStep} of {totalSteps}</span>
      </div>
    </div>
  )
}

const SaveProgressBanner = ({ onDismiss }) => (
  <div className="relative bg-accent-green-50 border-2 border-accent-green-300 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
    <div className="pr-8 sm:pr-0">
      <p className="font-semibold text-accent-green-900">Don&apos;t lose this progress</p>
      <p className="text-sm text-accent-green-800">
        You&apos;re only saved on this device. Create a free account to keep your plan and pick up anywhere.
      </p>
    </div>
    <div className="flex items-center gap-3 shrink-0">
      <Link href="/login?mode=signup" className="btn-secondary px-4 py-2 text-sm whitespace-nowrap">
        Save my progress
      </Link>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="absolute top-3 right-3 sm:static p-1 hover:bg-accent-green-100 rounded transition-colors shrink-0"
      >
        <X className="w-4 h-4 text-accent-green-700" />
      </button>
    </div>
  </div>
)

const ResetConfirmModal = ({ onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-2">Start Over?</h3>
      <p className="text-gray-600 mb-6">
        This will delete all your progress and start your journey from the beginning. This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  </div>
)

export default JourneyFlow
