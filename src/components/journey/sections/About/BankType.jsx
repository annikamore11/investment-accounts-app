import React, { useState, useEffect } from 'react'
import { Building, Smartphone, Briefcase, Landmark } from 'lucide-react'

const BankType = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [bankType, setBankType] = useState(journeyData.bankType || '')
  const [isExiting, setIsExiting] = useState(false)

  const handleNext = () => {
    updateJourneyData('bankType', bankType)
    setIsExiting(true)
    setTimeout(() => {
      nextStep()
    }, 500)
  }

const bankOptions = [
  {
    value: 'large',
    icon: Building,
    title: 'Major National Bank',
    description: 'Examples: Chase, Bank of America, Wells Fargo, Citi',
    note: 'Fastest — usually instant verification through online login.'
  },
  {
    value: 'regional',
    icon: Landmark,
    title: 'Regional Bank or Credit Union',
    description: 'Examples: First Interstate, Glacier, local credit unions',
    note: 'Takes 2–5 business days — verified via micro-deposits.'
  },
  {
    value: 'online',
    icon: Smartphone,
    title: 'Online-Only Bank',
    description: 'Examples: Ally, SoFi, Capital One 360, Chime',
    note: 'Can be instant or take several days — varies by integration support.'
  },
  {
    value: 'business',
    icon: Briefcase,
    title: 'Business or Joint Account',
    description: 'Used for LLCs, shared, or company-linked accounts',
    note: 'Typically 3–7 days — may require manual verification or ownership documents.'
  }
]


  return (
    <div className={`w-full max-w-4xl mx-auto transition-all duration-500 ${
      isExiting ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
    }`}>
      
      {/* Header Section */}
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          Bank Type
        </h1>
        
        
      </div>


      <div className="bg-primary-100 rounded-2xl shadow-xl p-8 md:p-12">

        <p className="text-xl text-primary-700 max-w-4xl mx-auto mb-6 text-center">
          What type of bank do you use?
        </p>

        {/* Info Box */}
        <div className="bg-purple-100 border border-purple-300 rounded-xl p-4 mb-6">
          <p className="text-sm text-purple-900">
            <strong>Why this matters:</strong> Different bank types have different verification processes when connecting to investment accounts. This helps us set expectations.
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {bankOptions.map(option => {
            const Icon = option.icon
            return (
              <button
                key={option.value}
                onClick={() => setBankType(option.value)}
                className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                  bankType === option.value
                    ? 'border-accent-green-600 bg-accent-green-50 shadow-sm'
                    : 'border-primary-400 hover:border-primary-600 hover:bg-gray-100 bg-primary-50'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 hidden md:block">
                    <Icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-lg mb-1">{option.title}</div>
                    <div className="text-sm text-gray-600 mb-2">{option.description}</div>
                    <div className="text-xs text-gray-500 italic">{option.note}</div>
                  </div>
                  {bankType === option.value && (
                    <svg className="w-6 h-6 text-accent-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Helpful note based on selection */}
        {(bankType === 'regional' || bankType === 'online' || bankType === 'business') && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-yellow-900">
              <strong>Good to know:</strong> Small, online, or business accounts may require manual verification, which can result in verification delays. Don't worry - we'll guide you through it!
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={prevStep}
            className="btn-journey-back"
            disabled={isExiting}
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={!bankType || isExiting}
            className={`flex-1 ${
              bankType && !isExiting
                ? 'btn-journey-next'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next →
          </button>
        </div>

        {!bankType && (
          <p className="text-sm text-gray-500 text-center mt-4">
            Please select your bank type to continue
          </p>
        )}
      </div>
    </div>
  )
}

export default BankType