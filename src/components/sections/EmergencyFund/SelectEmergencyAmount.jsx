import React, { useState } from 'react'

const SelectEmergencyAmount = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [selectedAmount, setSelectedAmount] = useState(journeyData.emergencyFundGoal || '')

  const monthlyExpenses = journeyData.monthlyExpenses || 0
  const minRecommended = monthlyExpenses * 3
  const maxRecommended = monthlyExpenses * 6

  const presetAmounts = [
    { value: monthlyExpenses * 3, label: `$${(monthlyExpenses * 3).toLocaleString()}`, months: '3 months' },
    { value: monthlyExpenses * 4, label: `$${(monthlyExpenses * 4).toLocaleString()}`, months: '4 months' },
    { value: monthlyExpenses * 5, label: `$${(monthlyExpenses * 5).toLocaleString()}`, months: '5 months' },
    { value: monthlyExpenses * 6, label: `$${(monthlyExpenses * 6).toLocaleString()}`, months: '6 months' },
  ]

  const handleNext = () => {
    updateJourneyData('emergencyFundGoal', selectedAmount)
    
    setTimeout(() => {
      nextStep()
    }, 50)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          Choose Your Goal
        </h1>
        <p className="text-lg text-primary-200 max-w-4xl mx-auto">
          How much do you want in your emergency fund?
        </p>
      </div>

      <div className="bg-primary-100 rounded-xl shadow-xl p-8 md:p-12">
        
        {/* Info Box */}
        <div className="bg-accent-purple-50 border border-accent-purple-300 rounded-xl p-4 mb-6">
          <p className="text-sm text-accent-purple-900">
            <strong>Don't worry!</strong> You don't need to have this amount right now. This is your <em>goal</em> to build over time.
          </p>
        </div>

        {/* Preset Options */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-900 mb-4">
            Select a target amount:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {presetAmounts.map(option => (
              <button
                key={option.value}
                onClick={() => setSelectedAmount(option.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedAmount === option.value
                    ? 'border-accent-green-600 bg-accent-green-50 shadow-md'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <p className="text-xl font-bold text-gray-900">{option.label}</p>
                <p className="text-xs text-gray-600 mt-1">{option.months}</p>
                {selectedAmount === option.value && (
                  <svg className="w-5 h-5 text-accent-green-600 mx-auto mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6 mb-6">
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Or enter your own goal:
          </label>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-700 mr-2">$</span>
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
              className="flex-1 text-2xl font-bold p-3 border-2 border-gray-300 rounded-lg focus:border-accent-green-600 focus:outline-none bg-white"
            />
          </div>
          
          <div className="bg-gradient-to-r from-accent-green-50 to-accent-green-100 border border-accent-green-600 rounded-lg p-3 mt-4">
            <p className="text-sm text-green-800">
              <strong>Starting smaller?</strong> Even $1,000 is better than $0! You can always build it up over time.
            </p>
          </div>
        </div>

        {/* Visual Goal */}
        {selectedAmount > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-600 rounded-xl p-6 mb-6">
            <div className="text-center">
              <p className="text-gray-700 mb-2">Your Emergency Fund Goal</p>
              <p className="text-4xl font-bold text-green-700 mb-2">
                ${selectedAmount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                ~ {(selectedAmount / monthlyExpenses).toFixed()} months of expenses
              </p>
            </div>
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
    </div>
  )
}

export default SelectEmergencyAmount