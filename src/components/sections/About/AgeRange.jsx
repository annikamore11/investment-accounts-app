import React, { useState } from 'react'
import { Calendar, Check } from 'lucide-react'

const AgeRange = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [age, setAge] = useState(journeyData.age || '')

  const handleNext = () => {
    updateJourneyData('age', age)
    // Small delay to let state update
    setTimeout(() => {
      nextStep()
    }, 50)
  }

  const ageOptions = [
    { 
      value: '18-25', 
      label: '18-25'
    },
    { 
      value: '26-35', 
      label: '26-35'
    },
    { 
      value: '36-45', 
      label: '36-45'
    },
    { 
      value: '46+', 
      label: '46+'
    }
  ]

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mt-10 mb-6 lg:mb-10">
        
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          Age Range
        </h1>
        
        <p className="text-lg text-primary-200 max-w-4xl mx-auto">
          Our site is geared towards beginners. Age helps us recommend the right investment timelines.
        </p>
      </div>

      <div className="bg-primary-100 rounded-2xl shadow-xl p-8 md:p-12">
        {/* Info Box */}
        <div className="bg-purple-100 border border-purple-300 rounded-xl p-4 mb-6">
          <p className="text-sm text-purple-900">
            <strong>Why this matters:</strong> Your age affects how much time your investments have to grow and what investment strategies make sense for you.
          </p>
        </div>

        {/* Options - use grid for better horizontal use */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {ageOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setAge(option.value)}
              className={`flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all duration-200 text-left
                ${age === option.value
                  ? 'border-accent-green-600 bg-accent-green-50 shadow-sm'
                  : 'border-primary-400 hover:border-primary-600 hover:bg-gray-100 bg-primary-50'
                }`}
            >
              <span className="font-medium text-gray-800">{option.label}</span>
              {age === option.value && (
                <Check className="w-5 h-5 text-accent-green-600" />
              )}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={prevStep}
            className="btn-journey-back"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={!age}
            className={`flex-1 ${
              age
                ? 'btn-journey-next'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next →
          </button>
        </div>

        {!age && (
          <p className="text-sm text-gray-500 text-center mt-4">
            Please select your age range to continue
          </p>
        )}
      </div>
    </div>
  )
}

export default AgeRange