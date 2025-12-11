// components/journey/JourneyFlow.jsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { X, Menu, Check, ChevronDown, ChevronRight } from 'lucide-react'
import { loadJourneyFromDatabase, deleteJourneyFromDatabase } from '../../utils/JourneyStorage'
import { useJourneySave } from '../../hooks/useJourneySave'

// Import section configurations
import { welcomeConfig } from '@/components/journey/sections/Welcome'
import { aboutConfig } from './sections/About'
import { budgetConfig } from './sections/BudgetIncome'
import { emergencyFundConfig } from './sections/EmergencyFund'
import { retirementConfig } from './sections/Retirement'

const INITIAL_JOURNEY_DATA = {
  // About You
  employment: '',
  hasEmployer401k: null,
  age: '',
  hasBankAccount: null,
  bankType: '',
    
  // Budget & Income
  monthlyExpenses: '',
  needsExpenseHelp: null,
  rent: '',
  carPayment: '',
  food: '',
  insurance: '',
  utilities: '',
  other: '',
  monthlyIncome: '',
  estimatedTaxPercentage: '',
  estimatedTaxDollarAmount: '',
  payFrequency: '',

  // Emergency Fund Data
  hasEmergencyFund: null,
  emergencyFundGoal: '',
  emergencyFundCurrentAmount: '',
  emergencyFundAccountType: '',
  emergencyFundInstitution: '',
  existingEmergencyFundInstitution: '',
  existingEmergencyFundType: '',
  existingEmergencyFundAmount: '',

  // Retirement Data
  matchPercent: '',
  salaryMatchLimit: '',
  userContribution: '',

  // Track last step for each section
  lastStepInSection: {
    welcome: 0,
    aboutYou: 0,
    budget: 0,
    emergencyFund: 0,
    retirement: 0,
  },

  // Section completion
  sectionCompletion: {
    welcome: false,
    aboutYou: false,
    budget: false,
    emergencyFund: false,
  },

  // Track completed steps for each section (array of step indices)
  completedSteps: {
    welcome: [],
    aboutYou: [],
    budget: [],
    emergencyFund: [],
    retirement: [],
  }
}

const JourneyFlow = () => {
  const { user } = useAuth()
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [expandedSections, setExpandedSections] = useState({})
  const mainContentRef = useRef(null)

  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [journeyData, setJourneyData] = useState(INITIAL_JOURNEY_DATA)

  const [currentSection, setCurrentSection] = useState('welcome')
  const [currentStepInSection, setCurrentStepInSection] = useState(0)

  // Section configurations
  const sectionConfigs = [
    welcomeConfig,
    aboutConfig,
    budgetConfig,
    emergencyFundConfig,
    retirementConfig
  ]

  // Load progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      if (user) {
        const { success, data } = await loadJourneyFromDatabase(user.id)
        if (success && data) {
          // Merge with INITIAL_JOURNEY_DATA to ensure new fields exist
          setJourneyData({ ...INITIAL_JOURNEY_DATA, ...data.journey_data })
          setCurrentSection(data.current_section || 'welcome')
          setCurrentStepInSection(data.current_step || 0)
        }
      } else if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('journey_guest')
        if (saved) {
          const parsed = JSON.parse(saved)
          // Merge with INITIAL_JOURNEY_DATA to ensure new fields exist
          setJourneyData({ ...INITIAL_JOURNEY_DATA, ...parsed.data })
          setCurrentSection(parsed.section || 'welcome')
          setCurrentStepInSection(parsed.stepInSection || 0)
        }
      }
    }
    loadProgress()
  }, [user])

  // Auto-save progress
  useJourneySave(user, journeyData, currentSection, currentStepInSection)

  // Reset data and journey
  const handleStartOver = async () => {
    if (user) {
      await deleteJourneyFromDatabase(user.id)
      localStorage.removeItem(`journey_${user.id}`)
    } else {
      localStorage.removeItem('journey_guest')
    }
    
    // Reset to initial state
    setJourneyData(INITIAL_JOURNEY_DATA)
    setCurrentSection('welcome')
    setCurrentStepInSection(0)
    setShowResetConfirm(false)
    scrollToTop()
  }

  // Get current section
  const getCurrentSection = () => {
    return sectionConfigs.find(s => s.id === currentSection)
  }

  // Get current steps (dynamic)
  const getCurrentSteps = () => {
    const section = getCurrentSection()
    if (!section) return []
    
    if (typeof section.getSteps === 'function') {
      return section.getSteps(journeyData)
    }
    
    return section.steps || []
  }

  // Scroll helper
  const scrollToTop = () => {
    setTimeout(() => {
      if (mainContentRef.current) {
        mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 50)
  }

  // Next step
  const nextStep = () => {
    const section = getCurrentSection()
    const steps = getCurrentSteps()

    if (!section || steps.length === 0) return

    // Mark current step as completed
    setJourneyData(prev => {
      const currentCompleted = prev.completedSteps[currentSection] || []
      const updatedCompleted = currentCompleted.includes(currentStepInSection)
        ? currentCompleted
        : [...currentCompleted, currentStepInSection]

      return {
        ...prev,
        completedSteps: {
          ...prev.completedSteps,
          [currentSection]: updatedCompleted
        }
      }
    })

    if (currentStepInSection < steps.length - 1) {
      // Next step in section
      const newStep = currentStepInSection + 1
      setCurrentStepInSection(newStep)

      // Save last step for this section
      setJourneyData(prev => ({
        ...prev,
        lastStepInSection: {
          ...prev.lastStepInSection,
          [currentSection]: newStep
        }
      }))
    } else {
      // Section complete
      setJourneyData(prev => ({
        ...prev,
        sectionCompletion: {
          ...prev.sectionCompletion,
          [currentSection]: true
        },
        lastStepInSection: {
          ...prev.lastStepInSection,
          [currentSection]: currentStepInSection
        }
      }))

      // Move to next section
      const currentIndex = sectionConfigs.findIndex(s => s.id === currentSection)
      if (currentIndex < sectionConfigs.length - 1) {
        const nextSectionId = sectionConfigs[currentIndex + 1].id
        setCurrentSection(nextSectionId)
        setCurrentStepInSection(journeyData.lastStepInSection[nextSectionId] || 0)
      }
    }

    scrollToTop()
  }

  // Previous step
  const prevStep = () => {
    if (currentStepInSection > 0) {
      const newStep = currentStepInSection - 1
      setCurrentStepInSection(newStep)
      
      // Save last step for this section
      setJourneyData(prev => ({
        ...prev,
        lastStepInSection: {
          ...prev.lastStepInSection,
          [currentSection]: newStep
        }
      }))
    } else {
      const currentIndex = sectionConfigs.findIndex(s => s.id === currentSection)
      if (currentIndex > 0) {
        const prevSection = sectionConfigs[currentIndex - 1]
        const prevSectionId = prevSection.id
        setCurrentSection(prevSectionId)
        const prevSteps = typeof prevSection.getSteps === 'function'
          ? prevSection.getSteps(journeyData)
          : prevSection.steps || []
        const lastStep = journeyData.lastStepInSection[prevSectionId] || Math.max(0, prevSteps.length - 1)
        setCurrentStepInSection(lastStep)
      }
    }
    scrollToTop()
  }

  // Update journey data
  const updateJourneyData = (key, value) => {
    setJourneyData(prev => ({ ...prev, [key]: value }))
  }

  // Go to section
  const goToSection = (sectionId, stepIndex = null) => {
    setCurrentSection(sectionId)
    if (stepIndex !== null) {
      setCurrentStepInSection(stepIndex)
    } else {
      setCurrentStepInSection(journeyData.lastStepInSection?.[sectionId] || 0)
    }
    scrollToTop()
  }

  // Toggle section expansion
  const toggleSectionExpansion = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  // Get step names for a section
  const getSectionStepNames = (section) => {
    // Check for dynamic getStepNames function first
    if (typeof section.getStepNames === 'function') {
      return section.getStepNames(journeyData)
    }
    // Then check for static stepNames array
    if (section.stepNames) {
      return section.stepNames
    }
    // Fallback to generic step names
    const steps = typeof section.getSteps === 'function'
      ? section.getSteps(journeyData)
      : section.steps || []
    return steps.map((_, index) => `Step ${index + 1}`)
  }

  // Get completion count for a section
  const getSectionCompletion = (section) => {
    const steps = typeof section.getSteps === 'function'
      ? section.getSteps(journeyData)
      : section.steps || []
    const totalSteps = steps.length
    const completed = journeyData.completedSteps?.[section.id] || []
    const completedCount = completed.length

    return { completedCount, totalSteps, isFullyCompleted: completedCount === totalSteps && totalSteps > 0 }
  }

  // Section progress bar component
  const SectionProgressBar = ({ currentStep, totalSteps }) => {
    const progress = (currentStep / totalSteps) * 100

    return (
      <div className={`mb-6 mt-6 md:mt-0
        ${isSidebarOpen
          ? 'w-full'
          : 'max-w-6xl mx-auto'
        }
      `}>
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

  // Render step
  const renderStep = () => {
    const section = getCurrentSection()
    const steps = getCurrentSteps()
    
    if (!section || !steps[currentStepInSection]) {
      return (
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-gray-600">Step not found</p>
        </div>
      )
    }

    const StepComponent = steps[currentStepInSection]
    
    return (
      <StepComponent
        journeyData={journeyData}
        updateJourneyData={updateJourneyData}
        nextStep={nextStep}
        prevStep={prevStep}
      />
    )
  }

    return (
    <>
      <div className="fixed inset-0 overflow-hidden static-background"></div>
      <div className="fixed top-18 left-0 w-full border-b border-primary-500/40 z-50"></div>
      
      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Start Over?</h3>
            <p className="text-gray-600 mb-6">
              This will delete all your progress and start your journey from the beginning. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStartOver}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen relative" style={{ zIndex: 1 }}>
        <div className="pt-18">
          
          {/* Sidebar */}
          <aside 
            className={`
              absolute top-18 left-0 bg-zinc-950 shadow-lg transition-transform duration-300 z-40 
              md:border-r border-primary-500/40
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              w-full md:w-64 flex flex-col
            `}
            style={{ height: 'calc(100vh - 4rem)' }}
          >
            <div className="flex items-center justify-between p-6">
              <h2 className="text-xl font-bold text-primary-100">Your Journey</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5 text-primary-100" />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-6 space-y-1">
              {sectionConfigs.map((section) => {
                const isActive = currentSection === section.id
                const isExpanded = expandedSections[section.id]
                const stepNames = getSectionStepNames(section)
                const hasMultipleSteps = stepNames.length > 1
                const { completedCount, totalSteps, isFullyCompleted } = getSectionCompletion(section)
                const completedStepsArray = journeyData.completedSteps?.[section.id] || []

                return (
                  <div key={section.id} className="mb-1">
                    <button
                      onClick={() => goToSection(section.id)}
                      className={`
                        w-full text-left px-4 py-2.5 rounded-lg transition-all flex items-center justify-between
                        ${isFullyCompleted
                          ? 'bg-green-600 text-white shadow-md hover:bg-green-700'
                          : isActive
                            ? 'bg-green-50 text-green-700'
                            : 'bg-primary-50/50 text-gray-800 hover:bg-primary-300/50'
                        }
                      `}
                    >
                      <div className="font-medium text-sm">{section.title}</div>
                      <div className="flex items-center gap-2">
                        {hasMultipleSteps && (
                          <span className={`text-xs font-medium ${isFullyCompleted ? 'text-white' : 'text-gray-600'}`}>
                            {completedCount}/{totalSteps}
                          </span>
                        )}
                        {hasMultipleSteps && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleSectionExpansion(section.id)
                            }}
                            className="p-1 hover:bg-primary-300/30 rounded transition-colors cursor-pointer"
                            role="button"
                            aria-label={isExpanded ? "Collapse steps" : "Expand steps"}
                          >
                            {isExpanded ? (
                              <ChevronDown className={`w-4 h-4 ${isFullyCompleted ? 'text-white' : 'text-primary-200'}`} />
                            ) : (
                              <ChevronRight className={`w-4 h-4 ${isFullyCompleted ? 'text-white' : 'text-primary-200'}`} />
                            )}
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Step Dropdown */}
                    {hasMultipleSteps && isExpanded && (
                      <div className="mt-1 space-y-0.5 animate-fadeIn">
                        {stepNames.map((stepName, stepIndex) => {
                          const isCurrentStep = isActive && currentStepInSection === stepIndex
                          const isStepCompleted = completedStepsArray.includes(stepIndex)

                          return (
                            <button
                              key={stepIndex}
                              onClick={() => goToSection(section.id, stepIndex)}
                              className={`
                                w-full text-left px-4 py-1.5 rounded text-xs transition-all flex items-center justify-between gap-2 cursor-pointer
                                ${isCurrentStep
                                  ? 'bg-accent-green-100 text-accent-green-800 font-medium'
                                  : isStepCompleted
                                    ? 'text-primary-300 hover:text-primary-200 hover:bg-primary-700/30'
                                    : 'text-primary-400 hover:text-primary-300 hover:bg-primary-700/30'
                                }
                              `}
                            >
                              <span>{stepName}</span>
                              {isStepCompleted && (
                                <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>

            {/* Start Over Button at bottom of sidebar */}
            <div className="p-6 px-10">
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full px-4 py-2 text-xl font-bold text-primary-100 hover:text-red-400 rounded-lg transition-colors font-Gloock" // or whatever your h2 font class is
              >
                Start Over
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
            <div ref={mainContentRef} className="h-[calc(100vh-4rem)] overflow-y-auto">
              <div className={`px-2 md:px-8 py-2 md:py-8 min-h-full
              ${isSidebarOpen
                ? 'w-full static-background mx-auto'
                : 'w-full static-background'
              }
              `}
              >
                {/* Hamburger button */}
                {!isSidebarOpen && (
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="absolute md:top-7 bg-zinc-950 shadow-lg p-3 rounded-lg hover:bg-gray-700 transition-transform duration-300 z-50"
                  >
                    <Menu className="w-6 h-6 text-primary-100" />
                  </button>
                )}

                {/* Progress Bar */}
                {getCurrentSection()?.multipleSteps && getCurrentSteps().length > 1 && (
                  <SectionProgressBar 
                    currentStep={currentStepInSection + 1}
                    totalSteps={getCurrentSteps().length}
                  />
                )}

                {/* Render Step */}
                <div 
                  key={`${currentSection}-${currentStepInSection}`}
                  className="fadeInCard"
                >
                  {renderStep()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default JourneyFlow