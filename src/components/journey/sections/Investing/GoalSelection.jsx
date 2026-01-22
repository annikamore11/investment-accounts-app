import React, { useState } from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'
import { Plus, Trash2, Calendar, DollarSign, Target, AlertCircle } from 'lucide-react'

const GoalSelection = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()
  const [goals, setGoals] = useState(journeyData.investingGoals || [
    { id: 1, name: '', amount: '', timeframe: '' }
  ])
  const [errors, setErrors] = useState({})

  const addGoal = () => {
    const newId = Math.max(...goals.map(g => g.id), 0) + 1
    setGoals([...goals, { id: newId, name: '', amount: '', timeframe: '' }])
  }

  const removeGoal = (id) => {
    if (goals.length > 1) {
      setGoals(goals.filter(g => g.id !== id))
      // Remove errors for this goal
      const newErrors = { ...errors }
      delete newErrors[id]
      setErrors(newErrors)
    }
  }

  const updateGoal = (id, field, value) => {
    setGoals(goals.map(g => 
      g.id === id ? { ...g, [field]: value } : g
    ))
    
    // Clear error for this field when user starts typing
    if (errors[id]?.[field]) {
      setErrors({
        ...errors,
        [id]: {
          ...errors[id],
          [field]: null
        }
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

  const validateGoals = () => {
    const newErrors = {}
    let hasErrors = false

    goals.forEach(goal => {
      if (goal.name.trim()) {
        const goalErrors = {}
        
        if (!goal.amount.trim()) {
          goalErrors.amount = 'Amount is required'
          hasErrors = true
        }
        
        if (!goal.timeframe.trim()) {
          goalErrors.timeframe = 'Timeframe is required'
          hasErrors = true
        } else if (!validateTimeframe(goal.timeframe)) {
          goalErrors.timeframe = 'Enter a number, "<1", or "none"'
          hasErrors = true
        }
        
        if (Object.keys(goalErrors).length > 0) {
          newErrors[goal.id] = goalErrors
        }
      }
    })

    setErrors(newErrors)
    return !hasErrors
  }

  const handleNext = () => {
    if (validateGoals()) {
      const validGoals = goals.filter(g => g.name.trim())
      updateJourneyData('investingGoals', validGoals)
      transitionTo(nextStep)
    }
  }

  const handleBack = () => {
    transitionTo(prevStep)
  }

  const canContinue = goals.some(g => g.name.trim())

  return (
    <StepContainer
      title="Set Your Investment Goals"
      subtitle="What would you like to save and invest for?"
      isExiting={isExiting}
    >
      <div className="space-y-6">
        <p className="text-gray-700 leading-relaxed">
          Add one or more goals you'd like to work toward. Include how much you want to save and when you'd like to reach it.
        </p>

        {/* Goals list */}
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <div
              key={goal.id}
              className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-accent-green-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-accent-green-100 p-2 rounded-lg">
                    <Target className="w-4 h-4 text-accent-green-700" />
                  </div>
                  <span className="font-semibold text-gray-900">Goal {index + 1}</span>
                </div>
                {goals.length > 1 && (
                  <button
                    onClick={() => removeGoal(goal.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    aria-label="Remove goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
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
                    onChange={(e) => updateGoal(goal.id, 'name', e.target.value)}
                    placeholder="House, kids' college, wedding..."
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
                          updateGoal(goal.id, 'amount', value)
                        }}
                        placeholder="25000"
                        className={`w-full pl-9 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-accent-green-500 transition-all ${
                          errors[goal.id]?.amount 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-300 focus:border-accent-green-500'
                        }`}
                      />
                    </div>
                    {errors[goal.id]?.amount && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors[goal.id].amount}</span>
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
                        onChange={(e) => updateGoal(goal.id, 'timeframe', e.target.value)}
                        placeholder="<1, 5, 10, none"
                        className={`w-full pl-9 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-accent-green-500 transition-all ${
                          errors[goal.id]?.timeframe 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-300 focus:border-accent-green-500'
                        }`}
                      />
                    </div>
                    {errors[goal.id]?.timeframe && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors[goal.id].timeframe}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add goal button */}
        <button
          onClick={addGoal}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-accent-green-600 hover:text-accent-green-700 hover:bg-accent-green-50 transition-all flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Another Goal
        </button>
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