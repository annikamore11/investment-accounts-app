import React, { useState } from 'react'

const SelectEmergencyAmount = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [selectedAmount, setSelectedAmount] = useState(journeyData.emergencyFundGoal || '')
  const [currentSavings, setCurrentSavings] = useState(journeyData.emergencyFundCurrentAmount || '')

  const monthlyExpenses = journeyData.monthlyExpenses || 0
  const minRecommended = monthlyExpenses * 3
  const maxRecommended = monthlyExpenses * 6

  // Calculate progress percentage
  const savedAmount = parseFloat(currentSavings) || 0
  const goalAmount = parseFloat(selectedAmount) || 0
  const progressPercentage = goalAmount > 0 ? Math.min((savedAmount / goalAmount) * 100, 100) : 0

  const presetAmounts = [
    { value: monthlyExpenses * 3, label: `$${(monthlyExpenses * 3).toLocaleString()}`, months: '3 months' },
    { value: monthlyExpenses * 4, label: `$${(monthlyExpenses * 4).toLocaleString()}`, months: '4 months' },
    { value: monthlyExpenses * 5, label: `$${(monthlyExpenses * 5).toLocaleString()}`, months: '5 months' },
    { value: monthlyExpenses * 6, label: `$${(monthlyExpenses * 6).toLocaleString()}`, months: '6 months' },
  ]

  const handleNext = () => {
    updateJourneyData('emergencyFundGoal', goalAmount)
    updateJourneyData('emergencyFundCurrentAmount', savedAmount)
    
    setTimeout(() => {
      nextStep()
    }, 50)
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-100 mb-3">
          Choose Your Goal
        </h1>
        <p className="text-base md:text-lg text-primary-200 max-w-4xl mx-auto">
          How much do you want in your emergency fund?
        </p>
      </div>

      <div className="bg-primary-100 rounded-xl shadow-xl p-4 md:p-8 lg:p-12">
        
        {/* Info Box */}
        <div className="bg-accent-purple-50 border border-accent-purple-300 rounded-xl p-3 md:p-4 mb-6">
          <p className="text-sm text-accent-purple-900">
            <strong>Don't worry!</strong> You don't need to have this amount right now. This is your <em>goal</em> to build over time.
          </p>
        </div>

        {/* Preset Options */}
        <div className="mb-6">
          {monthlyExpenses !== 0 ? (
            <>
              <label className="block text-base md:text-lg font-semibold text-gray-900 mb-4">
                Select a target amount:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {presetAmounts.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedAmount(option.value)}
                    className={`p-3 md:p-4 rounded-xl border-2 transition-all ${
                      selectedAmount === option.value
                        ? 'border-accent-green-600 bg-accent-green-50 shadow-md'
                        : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                  >
                    <p className="text-lg md:text-xl font-bold text-gray-900">{option.label}</p>
                    <p className="text-xs text-gray-600 mt-1">{option.months}</p>
                    
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div></div>
          )}
          
        </div>

        {/* Custom Amount */}
        <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-4 md:p-6 mb-6">
          {monthlyExpenses === 0 ? (
            <label className="block text-base md:text-lg font-semibold text-gray-900 mb-3">
              Enter your goal:
            </label>
          ) : (
            <label className="block text-base md:text-lg font-semibold text-gray-900 mb-3">
              Or enter your own goal:
            </label>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-bold text-gray-700">$</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="15000"
              value={typeof selectedAmount === 'number' && !presetAmounts.some(a => a.value === selectedAmount) ? selectedAmount : ''}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '')
                if (value) {
                  setSelectedAmount(parseInt(value))
                } else {
                  setSelectedAmount('')
                }
              }}
              className="flex-1 min-w-0 text-xl md:text-2xl font-bold p-2 md:p-3 border-2 border-gray-300 rounded-lg focus:border-accent-green-600 focus:outline-none bg-white"
            />
          </div>
          
          
        </div>

        {/* Current Savings */}
        {selectedAmount > 0 && (
          <div className="mb-6 animate-fadeIn">
            <label className="block text-base md:text-lg font-semibold text-gray-900 mb-3">
              How much would you like to start your emergency fund with?
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Enter $0 if you want to set up your account without transferring money yet.
            </p>
            <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-bold text-gray-700">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={currentSavings}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '')
                    setCurrentSavings(value)
                  }}
                  className="flex-1 min-w-0 text-xl md:text-2xl font-bold p-2 md:p-3 border-2 border-gray-300 rounded-lg focus:border-accent-green-600 focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {goalAmount > 0 && currentSavings !== '' && (
          <div className="mb-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Progress to Goal</span>
              <span className="text-sm font-bold text-accent-green-700">
                {progressPercentage.toFixed(0)}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-300 rounded-full h-3 mb-2 overflow-hidden">
              <div
                className="bg-accent-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Amounts */}
            <div className="flex justify-between text-sm text-gray-700">
              <span>${savedAmount.toLocaleString()} saved</span>
              <span>${goalAmount.toLocaleString()} goal</span>
            </div>

            {/* Remaining or Celebration */}
            {savedAmount < goalAmount ? (
              <p className="text-xs text-gray-600 mt-2 text-center">
                ${(goalAmount - savedAmount).toLocaleString()} left to reach your goal
              </p>
            ) : (
              <p className="text-sm text-accent-green-700 font-semibold mt-2 text-center">
                🎉 You've reached your goal!
              </p>
            )}
          </div>
        )}


        {/* Navigation */}
        <div className="flex gap-4">
          <button onClick={prevStep} className="btn-journey-back">
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedAmount}
            className={`flex-1 ${
              selectedAmount ? 'btn-journey-next' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next →
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 2000px;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default SelectEmergencyAmount