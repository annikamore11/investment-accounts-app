import React, { useState } from 'react'
import { Calendar } from 'lucide-react'

const PayFrequency = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [frequency, setFrequency] = useState(journeyData.payFrequency || '')

  const handleNext = () => {
    updateJourneyData('payFrequency', frequency)
    
    setTimeout(() => {
      nextStep()
    }, 50)
  }

  const frequencies = [
    { 
      value: 'weekly', 
      label: 'Weekly',
      description: 'Every week'
    },
    { 
      value: 'biweekly', 
      label: 'Bi-weekly',
      description: 'Every 2 weeks'
    },
    { 
      value: 'semimonthly', 
      label: 'Semi-monthly',
      description: 'Twice per month'
    },
    { 
      value: 'monthly', 
      label: 'Monthly',
      description: 'Once per month'
    },
    { 
      value: 'irregular', 
      label: 'Irregular/Variable',
      description: 'Freelance, contract, or varies'
    },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          Pay Frequency
        </h1>
        <p className="text-lg text-primary-200 max-w-4xl mx-auto">
          How often do you get paid?
        </p>
      </div>

      <div className="bg-primary-100 rounded-xl shadow-xl p-8 md:p-12">
        
        {/* Info Box */}
        <div className="bg-purple-100 border border-purple-300 rounded-xl p-4 mb-6">
          <p className="text-sm text-purple-900">
            <strong>Why this matters:</strong> Knowing your pay schedule helps us recommend the best times to set up automatic transfers to savings and investments.
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {frequencies.map(option => (
            <button
              key={option.value}
              onClick={() => setFrequency(option.value)}
              className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                frequency === option.value
                  ? 'border-accent-green-600 bg-accent-green-50 shadow-sm'
                  : 'border-primary-400 hover:border-primary-600 hover:bg-gray-100 bg-primary-50'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{option.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 text-lg mb-1">
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {option.description}
                  </div>
                </div>
                {frequency === option.value && (
                  <svg className="w-6 h-6 text-accent-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Helper text for irregular */}
        {frequency === 'irregular' && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-6">
            <p className="text-sm text-yellow-900">
              <strong>Tip:</strong> With irregular income, we'll help you set up a system to save a percentage of each payment rather than a fixed amount.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4">
          <button onClick={prevStep} className="btn-journey-back">
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={!frequency}
            className={`flex-1 ${
              frequency ? 'btn-journey-next' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next →
          </button>
        </div>

        {!frequency && (
          <p className="text-sm text-gray-500 text-center mt-4">
            Please select how often you get paid
          </p>
        )}
      </div>
    </div>
  )
}

export default PayFrequency