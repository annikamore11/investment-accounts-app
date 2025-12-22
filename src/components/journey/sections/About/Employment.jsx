'use client'

import { useState } from 'react'
import StepContainer from '@/components/ui/StepContainer'
import OptionGrid from '@/components/ui/OptionGrid'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'

const EmploymentStatus = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [employment, setEmployment] = useState(journeyData.employment || '')
  const { isExiting, transitionTo } = useStepTransition()

  const handleNext = () => {
    updateJourneyData('employment', employment)

    // Only update for employed people
    if (['self-employed', 'student', 'unemployed'].includes(employment)) {
      updateJourneyData('hasEmployer401k', false)
    }

    transitionTo(nextStep)
  }

  const employmentOptions = [
    { value: 'employed-company', label: 'Employed at a company' },
    { value: 'self-employed', label: 'Self-employed / Freelance' },
    { value: 'student', label: 'Student' },
    { value: 'unemployed', label: 'Not currently working' },
  ]

  return (
    <StepContainer
      title="Employment Status"
      isExiting={isExiting}
      exitDirection="horizontal"
    >
      <p className="text-center text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto mb-6">
        Choose the option that best describes your current situation.
      </p>

      <OptionGrid
        options={employmentOptions}
        selectedValue={employment}
        onChange={setEmployment}
      />

      <StepNavigation
        onBack={prevStep}
        onNext={handleNext}
        canGoNext={!!employment}
        isExiting={isExiting}
      />

      {!employment && (
        <p className="text-sm text-primary-500 text-center mt-3 animate-fadeIn">
          Please select an option to continue.
        </p>
      )}
    </StepContainer>
  )
}

export default EmploymentStatus
