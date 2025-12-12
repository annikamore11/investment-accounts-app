import React, { useState, useRef, useEffect } from 'react'
import { Check, AlertCircle } from 'lucide-react'
import Employer401k from '../About/Employer401k'

const Employer401kFollowup = ({
  journeyData,
  updateJourneyData,
  nextStep,
  prevStep,
  goToSection,
  getStepIndexInSection
}) => {
  const has401k = journeyData.hasEmployer401k
  const [hasMatch, setHasMatch] = useState(journeyData.hasEmployerMatch ?? null)
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipRef = useRef(null)

  const handleYes = () => {
    updateJourneyData('openIRA', true)
    setTimeout(nextStep, 0) // ensures the update happens first
  }

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const goBackTo401k = () => {
    updateJourneyData('hasEmployer401k', null)
    updateJourneyData('hasEmployerMatch', null)
    const stepIndex = getStepIndexInSection('aboutYou', Employer401k)
    goToSection('aboutYou', stepIndex)
  }

  const handleNext = () => {
    if (has401k === true) {
      updateJourneyData('hasEmployerMatch', hasMatch)
    }
    nextStep()
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
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          {has401k ? '401(k) Match' : 'Next Steps'}
        </h1>
      </div>

      <div className="bg-primary-100 rounded-2xl shadow-xl p-8 md:p-12">
        {!has401k && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <p className="text-lg text-gray-800 mb-6">
              You indicated that you're {getEmploymentLabel(journeyData.employment)} and <strong>do not have a 401(k)</strong>.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleYes}
                className="bg-accent-green-600 hover:bg-accent-green-700 text-white text-lg font-semibold px-8 py-3 rounded-xl shadow-md transition-all duration-300"
              >
                Continue to Set Up an IRA Account →
              </button>
              <button
                onClick={goBackTo401k}
                className="bg-accent-green-600 hover:bg-accent-green-700 text-white text-lg font-semibold px-8 py-3 rounded-xl shadow-md transition-all duration-300"
              >
                I would like to change my answer
              </button>
            </div>
          </div>
        )}

        {has401k && (
          <>
            <div className="text-center mb-4">
              <h1 className="text-xl inline-block text-center">
                You indicated that you have a 401k. Does your employer have a&nbsp;
                <span className="relative inline-block" ref={tooltipRef}>
                  <button
                    onClick={() => setShowTooltip(!showTooltip)}
                    className="text-accent-green-600 underline decoration-dotted font-medium cursor-pointer inline-flex items-center gap-0.2"
                  >
                    401k match
                    <span className="w-4 h-4 text-xs flex items-center justify-center border border-accent-green-600 rounded-full font-bold">
                      i
                    </span>
                  </button>

                  {showTooltip && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white border border-accent-green-600 text-gray-800 text-xs rounded-md p-3 shadow-md z-10 font-normal">
                      A 401(k) match is when your employer contributes extra money to your 401(k) based on how much you contribute. It’s free money to help you save for retirement!
                    </div>
                  )}
                </span>
                ?
              </h1>
            </div>

            <div className="bg-purple-100 border border-purple-300 rounded-xl p-4 mb-6">
              <p className="text-sm text-purple-900">
                <strong>Why this matters:</strong> Many employers match part of your contributions.
                Knowing this helps us recommend how much to contribute and where else to invest.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {[ 
                { value: true, label: 'Yes' }, 
                { value: false, label: 'No' }
              ].map(option => (
                <button
                  key={option.value.toString()}
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
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default Employer401kFollowup
