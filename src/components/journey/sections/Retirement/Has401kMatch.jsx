'use client'

import { useState } from 'react'
import { Percent, Info } from 'lucide-react'
import Link from 'next/link'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import InfoBox from '@/components/ui/InfoBox'
import useStepTransition from '@/hooks/useStepTransition'

const Has401kMatch = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [matchPercent, setMatchPercent] = useState(journeyData.matchPercent || '')
  const [salaryMatchLimit, setSalaryMatchLimit] = useState(journeyData.salaryMatchLimit || '')
  const [userContribution, setUserContribution] = useState(journeyData.userContribution || '')
  const { isExiting, transitionTo } = useStepTransition()

  const handleNext = () => {
    updateJourneyData('matchPercent', Number(matchPercent))
    updateJourneyData('salaryMatchLimit', Number(salaryMatchLimit))
    updateJourneyData('userContribution', Number(userContribution))
    transitionTo(nextStep)
  }

  const isComplete = matchPercent && salaryMatchLimit && userContribution

  return (
    <StepContainer
      title="Understanding Your 401(k) Match"
      subtitle="Let's break down your company's matching policy — this helps you make sure you're getting the full match!"
      isExiting={isExiting}
      exitDirection="horizontal"
    >
      <div className="space-y-8">
        {/* Step 1 */}
        <div>
          <label className="block text-base sm:text-lg font-medium text-primary-700 mb-2">
            How much does your company match what you put in?
          </label>
          <p className="text-sm text-primary-600 mb-3">
            Example: A 50% match means your employer adds 50 cents for every $1 you contribute.
          </p>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. 50"
              value={matchPercent}
              onChange={(e) => setMatchPercent(e.target.value)}
              className="w-full border-2 border-accent-green-600 rounded-xl px-4 py-3 text-lg text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-green-600"
            />
            <Percent className="absolute right-4 top-3.5 text-primary-500 w-5 h-5" />
          </div>
        </div>

        {/* Step 2 */}
        <div>
          <label className="block text-base sm:text-lg font-medium text-primary-700 mb-2">
            What's the highest percent of your salary they'll match?
          </label>
          <p className="text-sm text-primary-600 mb-3">
            Example: If the match stops at 6%, they only match the first 6% you contribute.
          </p>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. 6"
              value={salaryMatchLimit}
              onChange={(e) => setSalaryMatchLimit(e.target.value)}
              className="w-full border-2 border-accent-green-600 rounded-xl px-4 py-3 text-lg text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-green-600"
            />
            <Percent className="absolute right-4 top-3.5 text-primary-500 w-5 h-5" />
          </div>
        </div>

        {/* Step 3 */}
        <div>
          <label className="block text-base sm:text-lg font-medium text-primary-700 mb-2">
            What percent of your salary are you contributing right now?
          </label>
          <p className="text-sm text-primary-600 mb-3">
            Example: If you put in 6% of your salary, enter "6".
          </p>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. 5"
              value={userContribution}
              onChange={(e) => setUserContribution(e.target.value)}
              className="w-full border-2 border-accent-green-600 rounded-xl px-4 py-3 text-lg text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-green-600"
            />
            <Percent className="absolute right-4 top-3.5 text-primary-500 w-5 h-5" />
          </div>
        </div>

        <InfoBox
          type="info"
          message="Don't know what your match is? Go to your company's HR site and navigate to your benefits document. There should be info on your match stored there"
        />

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button onClick={prevStep} className="btn-journey-back flex-none order-1 sm:order-1" disabled={isExiting}>
            ← Back
          </button>
          <Link
            href="/"
            className="btn-more-information flex-none order-3 sm:order-2 text-center"
          >
            What's a company match?
          </Link>
          <button
            onClick={handleNext}
            disabled={!isComplete || isExiting}
            className={`flex-1 order-2 sm:order-3 ${
              isComplete && !isExiting
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
