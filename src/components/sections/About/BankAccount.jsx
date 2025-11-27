import React, { useState } from 'react'
import { Landmark, AlertCircle, Check } from 'lucide-react'

const BankAccount = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [hasBankAccount, setHasBankAccount] = useState(journeyData.hasBankAccount ?? null)
  const [isExiting, setIsExiting] = useState(false)
  

  const handleNext = () => {
    updateJourneyData('hasBankAccount', hasBankAccount)
    setIsExiting(true)
    setTimeout(() => {
      nextStep()
    }, 500)
  }

  const bankAccountOptions = [
    { 
      value: true, 
      label: 'Yes'
    },
    { 
      value: false, 
      label: 'No'
    }
  ]

  return (
    <div className={`w-full max-w-4xl mx-auto transition-all duration-500 ${
      isExiting ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
    }`}>
      {/* Header Section */}
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          Bank Account
        </h1>
        
        
      </div>
      <div className="bg-primary-100 rounded-xl shadow-xl p-8 md:p-12">
        <p className="text-xl text-primary-700 max-w-4xl mx-auto mb-6 text-center">
          Do you currently have a bank account (checking or savings)?
        </p>
        {/* Info Box */}
        <div className="bg-accent-purple-100 border border-accent-purple-300 rounded-xl p-4 mb-6">
          <p className="text-sm text-purple-900">
            <strong>Why this matters:</strong> You'll need a bank account to transfer money to your investment accounts.
          </p>
        </div>

        {/* Options - use grid for better horizontal use */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {bankAccountOptions.map(option => (
            <button
              key={option.value.toString()}
              onClick={() => setHasBankAccount(option.value)}
              className={`flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all duration-200 text-left
                ${hasBankAccount === option.value
                  ? 'border-accent-green-600 bg-accent-green-50 shadow-sm'
                  : 'border-accent-green-600 hover:border-accent-gray-400 hover:bg-gray-100 bg-white'
                }`}
            >
              <span className="font-medium text-gray-800">{option.label}</span>
              {hasBankAccount === option.value && (
                <Check className="w-5 h-5 text-accent-green-600" />
              )}
            </button>
          ))}
        </div>

        {/* Warning if no bank account */}
        {hasBankAccount === false && (
          <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-5 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-2">Action Required</h3>
                <p className="text-sm text-orange-800 mb-3">
                  You'll need to open a bank account before you can start investing. We recommend:
                </p>
                <ul className="text-sm text-orange-800 space-y-1 ml-4 list-disc">
                  <li>Large banks: Chase, Bank of America, Wells Fargo</li>
                  <li>Online banks: Ally, Marcus, Capital One 360</li>
                  <li>Credit unions in your area</li>
                </ul>
                <p className="text-sm text-orange-800 mt-3">
                  You can continue this journey and come back once you have an account set up.
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
            disabled={isExiting}
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={hasBankAccount === null || isExiting}
            className={`flex-1 ${
              hasBankAccount !== null && !isExiting
                ? 'btn-journey-next'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {hasBankAccount === false ? 'Continue Anyway →' : 'Next →'}
          </button>
        </div>

        {hasBankAccount === null && (
          <p className="text-sm text-gray-500 text-center mt-4">
            Please select an option to continue
          </p>
        )}
      </div>
    </div>
  )
}

export default BankAccount