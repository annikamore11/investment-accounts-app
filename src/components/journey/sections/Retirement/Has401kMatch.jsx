'use client'

import { useState } from 'react'
import { Percent } from 'lucide-react'
import StepContainer from '@/components/ui/StepContainer'
import InfoBox from '@/components/ui/InfoBox'
import useStepTransition from '@/hooks/useStepTransition'

const Has401kMatch = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [companyMatch, setCompanyMatch] = useState(journeyData.companyMatch || '')
  const [userContribution, setUserContribution] = useState(journeyData.userContribution || '')
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
      exitDirection="horizontal"
    >
      <div className="space-y-8">

        <div>
          <label className="text-center block text-xl font-medium text-gray-800 mb-2">
            What is your company match?
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. 5"
              value={companyMatch}
              onChange={(e) => setCompanyMatch(e.target.value)}
              className="w-full border border-accent-green-600 rounded-xl px-4 py-3 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-green-600"
            />
            <Percent className="absolute right-4 top-3.5 text-primary-500 w-5 h-5" />
          </div>
        </div>

        <div>
          <label className="text-center block text-xl font-medium text-gray-800 mb-2">
            What percent of your salary are you contributing right now?
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. 9"
              value={userContribution}
              onChange={(e) => setUserContribution(e.target.value)}
              className="w-full border border-accent-green-600 rounded-xl px-4 py-3 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-green-600"
            />
            <Percent className="absolute right-4 top-3.5 text-primary-500 w-5 h-5" />
          </div>
        </div>

        <InfoBox
          type="info"
          message="Don't know what your match is? Go to your company's HR site and navigate to your benefits document. There should be info on your match stored there."
        />

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button onClick={prevStep} className="btn-journey-back flex-none" disabled={isExiting}>
            ← Back
          </button>

          <button
            onClick={handleNext}
            disabled={!companyMatch || !userContribution}
            className={`flex-1 ${
              companyMatch && userContribution
                ? 'btn-journey-next'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next →
          </button>
        </div>

      </div>
    </StepContainer>
  )
}

export default Has401kMatch
