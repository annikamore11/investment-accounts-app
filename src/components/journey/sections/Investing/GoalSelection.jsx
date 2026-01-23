import React, { useState } from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'
import { Calendar, DollarSign, Target, AlertCircle, Info } from 'lucide-react'

const GoalSelection = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, direction, transitionTo } = useStepTransition()
  // Start with existing goal or a blank one
  const existingGoal = journeyData.investingGoals?.[0] || { name: '', amount: '', timeframe: '' }
  const [goal, setGoal] = useState(existingGoal)
  const [errors, setErrors] = useState({})

  const updateGoal = (field, value) => {
    setGoal({ ...goal, [field]: value })

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      })
    }
  }

  const validateTimeframe = (timeframe) => {
    if (!timeframe.trim()) return false
    
    const normalized = timeframe.toLowerCase().trim()
    
    // Check for special values
    if (normalized === '<1' || normalized === 'none') return true
    
    // Check if it's a valid integer
    const num = parseInt(timeframe, 10)
    return !isNaN(num) && num > 0 && num.toString() === timeframe.trim()
  }

  const validateGoal = () => {
    const newErrors = {}
    let hasErrors = false

    if (goal.name.trim()) {
      if (!goal.amount.trim()) {
        newErrors.amount = 'Amount is required'
        hasErrors = true
      }

      if (!goal.timeframe.trim()) {
        newErrors.timeframe = 'Timeframe is required'
        hasErrors = true
      } else if (!validateTimeframe(goal.timeframe)) {
        newErrors.timeframe = 'Enter a number, "<1", or "none"'
        hasErrors = true
      }
    }

    setErrors(newErrors)
    return !hasErrors
  }

  const handleNext = () => {
    if (validateGoal()) {
      // Store as array with single goal for consistency
      updateJourneyData('investingGoals', [goal])
      transitionTo(nextStep, 'forward')
    }
  }

  const handleBack = () => {
    transitionTo(prevStep, 'backward')
  }

  const canContinue = goal.name.trim()

  return (
    <StepContainer
      title="Choose Your Primary Investment Goal"
      subtitle="What would you like to save and invest for?"
      isExiting={isExiting}
      direction={direction}
    >
      <div className="space-y-6">
        <p className="text-gray-700 leading-relaxed">
          Let's start with your main investment goal. Include how much you want to save and when you'd like to reach it.
        </p>

        {/* Goal form */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-accent-green-500 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-accent-green-100 p-2 rounded-lg">
              <Target className="w-4 h-4 text-accent-green-700" />
            </div>
            <span className="font-semibold text-gray-900">Your Investment Goal</span>
          </div>

          <div className="space-y-4">
            {/* Goal name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What are you saving for?
              </label>
              <input
                type="text"
                value={goal.name}
                onChange={(e) => updateGoal('name', e.target.value)}
                placeholder="House down payment, kids' college, wedding..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-green-500 focus:border-accent-green-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Target amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={goal.amount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '')
                      updateGoal('amount', value)
                    }}
                    placeholder="25000"
                    className={`w-full pl-9 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-accent-green-500 transition-all ${
                      errors.amount
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-300 focus:border-accent-green-500'
                    }`}
                  />
                </div>
                {errors.amount && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.amount}</span>
                  </div>
                )}
              </div>

              {/* Timeframe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years until you need it
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={goal.timeframe}
                    onChange={(e) => updateGoal('timeframe', e.target.value)}
                    placeholder="<1, 5, 10, none"
                    className={`w-full pl-9 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-accent-green-500 transition-all ${
                      errors.timeframe
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-300 focus:border-accent-green-500'
                    }`}
                  />
                </div>
                {errors.timeframe && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.timeframe}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info box about adding more goals later */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-medium text-gray-900">Have multiple goals?</p>
              <p>
                For now, choose your most important goal to help you get started. You'll be able to add more goals in your dashboard, and we'll provide advice on how to organize and prioritize multiple investment goals.
              </p>
            </div>
          </div>
        </div>
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