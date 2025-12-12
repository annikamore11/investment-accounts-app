import React, { useState } from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import OptionGrid from '@/components/ui/OptionGrid'
import useStepTransition from '@/hooks/useStepTransition'

const GoalSelection = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()
  const [selectedGoal, setSelectedGoal] = useState(journeyData.investingGoal || '')
  const [customGoal, setCustomGoal] = useState(journeyData.customInvestingGoal || '')
  const [showCustomInput, setShowCustomInput] = useState(journeyData.investingGoal === 'custom')

  const goalOptions = [
    { value: 'home', label: 'Home Purchase' },
    { value: 'car', label: 'Car' },
    { value: 'education', label: 'Higher Education' },
    { value: 'travel', label: 'Travel' },
    { value: 'growth', label: 'No Specific Goal, Just Growth' },
    { value: 'custom', label: 'Other (Specify)' }
  ]

  const handleGoalChange = (value) => {
    setSelectedGoal(value)
    setShowCustomInput(value === 'custom')
    if (value !== 'custom') {
      setCustomGoal('')
    }
  }

  const handleNext = () => {
    updateJourneyData('investingGoal', selectedGoal)
    if (selectedGoal === 'custom') {
      updateJourneyData('customInvestingGoal', customGoal)
    }
    transitionTo(nextStep)
  }

  const handleBack = () => {
    transitionTo(prevStep)
  }

  const canContinue = selectedGoal && (selectedGoal !== 'custom' || customGoal.trim())

  return (
    <StepContainer
      title="Choose Your Investment Goal"
      subtitle="What would you like to invest for?"
      isExiting={isExiting}
    >
      <div className="space-y-6">
        <p className="text-gray-700 leading-relaxed">
          Select a goal you'd like to work toward. This will help us provide the best guidance for your situation.
        </p>

        <OptionGrid
          options={goalOptions}
          selectedValue={selectedGoal}
          onChange={handleGoalChange}
          columns={2}
        />

        {/* Custom goal input */}
        {showCustomInput && (
          <div className="animate-fadeIn">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's your investment goal?
            </label>
            <input
              type="text"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              placeholder="e.g., Starting a business, Wedding, etc."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-green-500 focus:border-accent-green-500 transition-all"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <StepNavigation
        onBack={handleBack}
        onNext={handleNext}
        canGoNext={canContinue}
        nextLabel="Next →"
        isExiting={isExiting}
      />
    </StepContainer>
  )
}

export default GoalSelection
