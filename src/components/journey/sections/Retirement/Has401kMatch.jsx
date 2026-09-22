'use client'

import { useState } from 'react'
import { Percent } from 'lucide-react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import InfoBox from '@/components/ui/InfoBox'
import useStepTransition from '@/hooks/useStepTransition'

const PercentInput = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="text-center block text-xl font-medium text-primary-800 mb-2">{label}</label>
    <div className="relative">
      <input
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ''))}
        className="w-full border border-accent-green-600 rounded-xl px-4 py-3 text-lg text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-green-600"
      />
      <Percent className="absolute right-4 top-3.5 text-primary-500 w-5 h-5" />
    </div>
  </div>
)

const Has401kMatch = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [companyMatch, setCompanyMatch] = useState(String(journeyData.companyMatch ?? ''))
  const [userContribution, setUserContribution] = useState(String(journeyData.userContribution ?? ''))
  const { isExiting, transitionTo } = useStepTransition()

  const handleNext = () => {
    updateJourneyData('companyMatch', Number(companyMatch))
    updateJourneyData('userContribution', Number(userContribution))
    transitionTo(nextStep)
  }

  return (
    <StepContainer
      title="Understanding Your 401(k) Match"
      subtitle="Let's break down your company's matching policy — this helps you make sure you're getting the full match!"
      isExiting={isExiting}
    >
      <div className="space-y-8">
        <PercentInput
          label="What is your company match?"
          value={companyMatch}
          onChange={setCompanyMatch}
          placeholder="e.g. 5"
        />
        <PercentInput
          label="What percent of your salary are you contributing right now?"
          value={userContribution}
          onChange={setUserContribution}
          placeholder="e.g. 9"
        />

        <InfoBox
          type="info"
          message="Don't know what your match is? Go to your company's HR site and navigate to your benefits document. There should be info on your match stored there."
        />

        <StepNavigation
          onBack={prevStep}
          onNext={handleNext}
          canGoNext={companyMatch !== '' && userContribution !== ''}
          isExiting={isExiting}
          className="mt-0"
        />
      </div>
    </StepContainer>
  )
}

export default Has401kMatch
