'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { X, Menu, Check } from 'lucide-react'
import { saveJourneyToDatabase, loadJourneyFromDatabase, deleteJourneyFromDatabase } from '../utils/JourneyStorage'

// Import section configurations
import { welcomeConfig } from '@/components/sections/Welcome'
import { aboutConfig } from './sections/About'
import { budgetConfig } from './sections/BudgetIncome'
import { emergencyFundConfig } from './sections/EmergencyFund'
import { retirementConfig } from './sections/Retirement'

const JourneyFlow = () => {
  const { user } = useAuth()
  const router = useRouter()
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const mainContentRef = useRef(null)
  
  // Journey state - ONLY store primitive values
  const [journeyData, setJourneyData] = useState({
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

    // Add this: Track last step for each section
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
    }
  })

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

  // When section changes, show intro
  useEffect(() => {
    if (currentSection === 'about' && !introComplete) {
      setShowSectionIntro(true)
      
      // Hide intro after 2.5 seconds and mark complete
      setTimeout(() => {
        setShowSectionIntro(false)
        setIntroComplete(true)
      }, 2500)
    }
  }, [currentSection])

  // Load progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      if (user) {
        const { success, data } = await loadJourneyFromDatabase(user.id)
        if (success && data) {
          setJourneyData(data.journey_data)
          setCurrentSection(data.current_section || 'welcome')
          setCurrentStepInSection(data.current_step || 0)
        }
      } else if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('journey_guest')
        if (saved) {
          const parsed = JSON.parse(saved)
          setJourneyData(parsed.data)
          setCurrentSection(parsed.section || 'welcome')
          setCurrentStepInSection(parsed.stepInSection || 0)
        }
      }
    }
    loadProgress()
  }, [user])

  // Save progress (debounced)
  useEffect(() => {
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

    const timeoutId = setTimeout(saveProgress, 1000)
    return () => clearTimeout(timeoutId)
  }, [journeyData, currentSection, currentStepInSection, user])

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

  // Next step - CLEAN implementation
  // Next step - CLEAN implementation
  const nextStep = () => {
    const section = getCurrentSection()
    const steps = getCurrentSteps()
    
    if (!section || steps.length === 0) return

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

  // Update journey data - ONLY primitives
  const updateJourneyData = (key, value) => {
    setJourneyData(prev => ({ ...prev, [key]: value }))
  }

  // Go to section
  const goToSection = (sectionId) => {
    setCurrentSection(sectionId)
    // Use last visited step instead of always 0, with safety check
    setCurrentStepInSection(journeyData.lastStepInSection?.[sectionId] || 0)
    scrollToTop()
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
        {/* Progress bar container */}
        <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-accent-green-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Labels */}
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
      <div className="fixed top-18 left-0 w-full border-b border-primary-400 z-50"></div>
      <div className="min-h-screen relative" style={{ zIndex: 1 }}>
        <div className="pt-16 relative">
          
          {/* Sidebar - slides up when footer visible */}
          <aside 
            className={`
              absolute top-0 left-0 bg-zinc-950 shadow-lg transition-transform duration-300 z-40 
              md:border-r border-primary-400 md:border-primary-400
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              w-full md:w-64 flex flex-col
            `}
            style={{ height: '100vh', paddingTop: '4rem' }}
          >
            <div className="flex items-center justify-between p-6">
              <h2 className="text-xl font-bold text-primary-100">Your Journey</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5 text-primary-100" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-6 space-y-2">
              {sectionConfigs.map((section) => {
                const isCompleted = journeyData.sectionCompletion[section.id]
                const isActive = currentSection === section.id
                return (
                  <button
                    key={section.id}
                    onClick={() => goToSection(section.id)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between
                      ${isActive 
                        ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                        : isCompleted 
                          ? 'btn-journey-next shadow-md' 
                          : 'bg-accent-purple-50 text-gray-800 opacity-50'
                      }
                    `}
                  >
                    <div className="font-medium">{section.title}</div>
                    {isCompleted && !isActive && (
                      <Check className="w-5 h-5 text-primary-100 flex-shrink-0" />
                    )}
                    {isCompleted && isActive && (
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <div className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
            <div ref={mainContentRef} className="h-[calc(100vh-4rem)] overflow-y-auto">
              <div className={` px-8 py-8 min-h-full
              ${isSidebarOpen
                ? 'w-full static-background mx-auto'
                : 'w-full static-background'
              }
              `}>
                {/* Hamburger button - positioned at top of content */}
                {!isSidebarOpen && (
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="absolute md:top-7 bg-zinc-950 shadow-lg p-3 rounded-lg hover:bg-gray-700 transition-transform duration-300 z-50"
                  >
                    <Menu className="w-6 h-6 text-primary-100" />
                  </button>
                )}
                {/* Progress Bar - Only show for multi-step sections */}
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

      {/* Hamburger button - hide when footer visible */}
      {/* {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-20 left-4 bg-zinc-950 shadow-lg rounded-lg p-3 hover:bg-gray-700 transition-transform duration-300"
          style={{ zIndex: 9999 }}
        >
          <Menu className="w-6 h-6 text-primary-100" />
        </button>
      )} */}
    </>
  )
}

export default JourneyFlow