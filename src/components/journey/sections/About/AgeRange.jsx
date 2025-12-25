'use client'

import { useState } from 'react'
import StepContainer from '@/components/ui/StepContainer'
import OptionGrid from '@/components/ui/OptionGrid'
import StepNavigation from '@/components/ui/StepNavigation'
import InfoBox from '@/components/ui/InfoBox'
import useStepTransition from '@/hooks/useStepTransition'

const AgeRange = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [age, setAge] = useState(journeyData.age || '')
  const { isExiting, transitionTo } = useStepTransition()

  const handleNext = () => {
    updateJourneyData('age', age)
    transitionTo(nextStep)
  }

  const ageOptions = [
    { value: '18-25', label: '18-25' },
    { value: '26-35', label: '26-35' },
    { value: '36-45', label: '36-45' },
    { value: '46+', label: '46+' }
  ]

  return (
    <StepContainer
      title="Age Range"
      isExiting={isExiting}
      exitDirection="horizontal"
    >
      <p className="text-lg sm:text-xl text-primary-100 max-w-4xl mx-auto text-center mb-6">
        Our site is geared towards beginners. Age helps us recommend the right investment timelines.
      </p>

      <InfoBox
        type="why"
        message="Your age affects how much time your investments have to grow and what investment strategies make sense for you."
      />

      <OptionGrid
        options={ageOptions}
        selectedValue={age}
        onChange={setAge}
      />

      <StepNavigation
        onBack={prevStep}
        onNext={handleNext}
        canGoNext={!!age}
        isExiting={isExiting}
      />

      {!age && (
        <p className="text-sm text-primary-100 text-center mt-4 animate-fadeIn">
          Please select your age range to continue
        </p>
      )}
    </StepContainer>
  )
}

export default AgeRange
