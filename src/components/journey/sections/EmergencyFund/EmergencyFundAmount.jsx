'use client'

import { useState } from 'react'
import StepContainer from '@/components/ui/StepContainer'
import OptionGrid from '@/components/ui/OptionGrid'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'

const EmergencyFundAmount = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [hasEmergencyFund, setHasEmergencyFund] = useState(journeyData.hasEmergencyFund ?? null)
  const { isExiting, transitionTo } = useStepTransition()

  const monthlyExpenses = journeyData.monthlyExpenses || 0
  const minRecommended = monthlyExpenses * 3
  const maxRecommended = monthlyExpenses * 6

  const handleNext = () => {
    updateJourneyData('hasEmergencyFund', hasEmergencyFund)
    transitionTo(nextStep)
  }

  const options = [
    {
      value: true,
      label: 'Yes',
      description: 'I have 3-6 months saved or am actively saving in a high-yield or money market account'
    },
    {
      value: false,
      label: 'No',
      description: 'I need help setting one up or want to learn more'
    }
  ]

  return (
    <StepContainer
      title="Your Emergency Fund Goal"
      subtitle="Based on your monthly expenses"
      isExiting={isExiting}
    >
      {/* Recommendation */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-300 rounded-xl p-6 mb-8">
        <p className="text-amber-900 font-semibold mb-2">
          Your monthly expenses: ${monthlyExpenses.toLocaleString()}
        </p>
        <p className="text-3xl font-bold text-amber-900 mb-2">
          Common Guideline: ${minRecommended.toLocaleString()} - ${maxRecommended.toLocaleString()}
        </p>
        <p className="text-sm text-amber-700">That's 3-6 months of expenses</p>
      </div>

      <div className="mb-8">
        <label className="block text-lg sm:text-xl font-semibold text-primary-700 mb-4">
          Do you already have a high-yield emergency fund saved?
        </label>

        <OptionGrid
          options={options}
          selectedValue={hasEmergencyFund}
          onChange={setHasEmergencyFund}
        />
      </div>

      <StepNavigation
        onBack={prevStep}
        onNext={handleNext}
        canGoNext={hasEmergencyFund !== null}
        isExiting={isExiting}
      />
    </StepContainer>
  )
}

export default EmergencyFundAmount
