import React, { useState } from 'react'
import { Check, AlertCircle } from 'lucide-react'


const Employer401kFollowup = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const has401k = journeyData.hasEmployer401k
  const [hasMatch, setHasMatch] = useState(journeyData.hasEmployerMatch ?? null)

  const handleNext = () => {
    if (has401k) {
      updateJourneyData('hasEmployerMatch', hasMatch)
    }
    nextStep({ has401k })
  }
  const getEmploymentLabel = (employment) => {
    const labels = {
      'self-employed': 'self employed',
      'employed-company': 'employed at a company',
      'student': 'a student',
      'unemployed': 'not employed',
      'other': 'other'
    }
    return labels[employment] || employment
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          {has401k ? '401K Match' : 'Next Steps'}
        </h1>
        {/* <p className="text-lg text-primary-200 max-w-3xl mx-auto">
          {has401k
            ? 'You indicated that you have a 401k. Does your employer have a 401k match?.'
            : 'Let’s move forward by setting up your first investment accounts.'}
        </p> */}
      </div>

      <div className="bg-primary-100 rounded-2xl shadow-xl p-8 md:p-12">
        {/* CASE 1: No 401k */}
        {!has401k && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <p className="text-lg text-gray-800 mb-6">
              You indicated that you're {getEmploymentLabel(journeyData.employment)} and<strong> do not have a 401(k)</strong>.
            </p>
            <button
              onClick={handleNext}
              className="bg-accent-green-600 hover:bg-accent-green-700 text-white text-lg font-semibold px-8 py-3 rounded-xl shadow-md transition-all duration-300"
            >
              Continue to Set Up an IRA Account →
            </button>
          </div>
        )}

        {/* CASE 2: Has 401k — Ask About Match */}
        {has401k && (
          <>
            <div className="text-center mb-4">
            <h1 className="text-xl">You indicated that you have a 401k. Does your employer have a 401k match?</h1>
            </div>

            <div className="mb-4">
                {/* empty space or future content */}
            </div>
            <div className="bg-purple-100 border border-purple-300 rounded-xl p-4 mb-6">
              <p className="text-sm text-purple-900">
                <strong>Why this matters:</strong> Many employers match part of your contributions.
                Knowing this helps us recommend how much to contribute and where else to invest.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {[ 
                { value: true, label: 'Yes' }, 
                { value: false, label: 'No' }, 
                { value: 'explain', label: 'What is a 401(k) match?' } 
            ].map(option => (
                <button
                key={option.value}
                onClick={() => setHasMatch(option.value)}
                className={`flex items-center justify-center px-8 py-2 rounded-xl border text-center text-lg font-medium transition-all duration-200
                    ${hasMatch === option.value
                    ? 'border-accent-green-600 bg-accent-green-50 shadow-md'
                    : 'border-accent-green-600 hover:border-accent-gray-400 hover:bg-gray-50'
                    }`}
                >
                <span className="text-gray-800">{option.label}</span>
                {hasMatch === option.value && (
                    <Check className="w-5 h-5 text-accent-green-600 ml-2" />
                )}
                </button>
            ))}
            </div>

            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[{ value: true, label: 'Yes' }, { value: false, label: 'No' }, { value: 'explain', label: 'What is a 401(k) match?' }].map(option => (
                <button
                  key={option.value}
                  onClick={() => setHasMatch(option.value)}
                  className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-200 text-left
                    ${hasMatch === option.value
                      ? 'border-accent-green-600 bg-accent-green-50 shadow-sm'
                      : 'border-accent-green-600 hover:border-accent-gray-400 hover:bg-gray-50'
                    }`}
                >
                  <span className="font-medium text-gray-800">{option.label}</span>
                  {hasMatch === option.value && (
                    <Check className="w-5 h-5 text-accent-green-600" />
                  )}
                </button>
              ))}
            </div> */}

           {/* Message appears only when nothing is selected */}
            {hasMatch === null && (
            <p className="text-sm text-gray-500 text-center mb-4">
                Please select an option to continue
            </p>
            )}

            <div className="flex gap-4">
            <button onClick={prevStep} className="btn-journey-back">
                ← Back
            </button>

            <button
                onClick={handleNext}
                disabled={hasMatch === null}
                className={`flex-1 ${
                hasMatch !== null
                    ? 'btn-journey-next'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
                Next →
            </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Employer401kFollowup
