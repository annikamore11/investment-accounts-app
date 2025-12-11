import React, { useState } from 'react'
import { Building, Check, X, CircleQuestionMark, AlertCircle } from 'lucide-react'

const Employer401k = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [has401k, setHas401k] = useState(journeyData.hasEmployer401k ?? null)

  const handleNext = () => {
    updateJourneyData('hasEmployer401k', has401k)
    setTimeout(() => {
      nextStep()
    }, 50)
  }

  const options401k = [
    { 
      value: true, 
      label: 'Yes'
    },
    { 
      value: false, 
      label: 'No, or Not Sure'
    }
  ]

  return (
    <div id="employer-401k" className="w-full max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mt-10 mb-6 lg:mb-10">
        
        
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          Employer 401(k) or 403(b)
        </h1>
        
        <p className="text-lg text-primary-200 max-w-4xl mx-auto">
          Does your employer offer a 401(k) or 403(b) retirement plan?
        </p>
      </div>

      <div className="bg-primary-100 rounded-2xl shadow-xl p-8 md:p-12">
        {/* Info Box */}
        <div className="bg-purple-100 border border-purple-300 rounded-xl p-4 mb-6">
          <p className="text-sm text-purple-900">
            <strong>Why this matters:</strong> If your employer offers a 401(k) or 403(b), especially with matching contributions, it's often the best place to start investing.
          </p>
        </div>

      {/* Options - use grid for better horizontal use */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {options401k.map(option => (
          <button
            key={option.value}
            onClick={() => setHas401k(option.value)}
            className={`flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all duration-200 text-left
              ${has401k === option.value
                ? 'border-accent-green-600 bg-accent-green-50 shadow-sm'
                : 'border-primary-400 hover:border-primary-600 hover:bg-gray-100 bg-primary-50'
              }`}
          >
          
            <span className="font-medium text-gray-800">{option.label}</span>
            {has401k === option.value && (
              <Check className="w-5 h-5 text-accent-green-600" />
            )}
          </button>
        ))}
      </div>

      {/* Warning if no bank account */}
      {has401k === false && (
        <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-5 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
           <div>
              <h3 className="font-semibold text-orange-900 mb-2">Worth Checking!</h3>
              <p className="text-sm text-orange-800 mb-3">
                Not sure if your employer offers a 401(k)? We highly recommend checking with your HR department or benefits portal.
              </p>
              <p className="text-sm text-orange-800 mb-3">
                Employer 401(k) plans often include free matching contributions—which can significantly accelerate your wealth-building journey.
              </p>
              <p className="text-sm text-orange-800 mt-3">
                Feel free to continue and come back to update your answer once you've confirmed.
              </p>
            </div>
          </div>
        </div>
      )}

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
          disabled={has401k === null}
          className={`flex-1 ${
            has401k !== null
              ? 'btn-journey-next'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next →
        </button>
      </div>

        {has401k === null && (
          <p className="text-sm text-gray-500 text-center mt-4">
            Please select an option to continue
          </p>
        )}
      </div>
    </div>
  )
}

export default Employer401k
