'use client'

import { useState } from 'react'
import StepContainer from '@/components/ui/StepContainer'
import OptionGrid from '@/components/ui/OptionGrid'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'

// The guideline/goal-setting happens one step earlier now (SelectEmergencyAmount,
// shown to everyone) — this step just needs the yes/no, which decides whether
// the Account Options/Setup Guide steps show next.
const EmergencyFundAmount = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [hasEmergencyFund, setHasEmergencyFund] = useState(journeyData.hasEmergencyFund ?? null)
  const { isExiting, transitionTo } = useStepTransition()

  const handleNext = () => {
    updateJourneyData('hasEmergencyFund', hasEmergencyFund)
    transitionTo(nextStep)
  }

  const options = [
    {
      value: true,
      label: 'Yes',
      description: 'I have money saved in a high-yield savings or money market account — not just sitting in a regular checking/savings account'
    },
    {
      value: false,
      label: 'No',
      description: 'I need help setting one up or want to learn more'
    }
  ]

  const goal = journeyData.emergencyFundGoal || 0

  return (
    <StepContainer
      title="Do You Already Have This Set Up?"
      subtitle={goal > 0 ? `Working toward your $${goal.toLocaleString()} goal` : undefined}
      isExiting={isExiting}
    >
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
