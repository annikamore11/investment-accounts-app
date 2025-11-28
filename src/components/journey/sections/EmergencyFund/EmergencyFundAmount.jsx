import React, { useState } from 'react'
import { Check, X, Sprout, Handshake } from 'lucide-react'

const EmergencyFundAmount = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [hasEmergencyFund, setHasEmergencyFund] = useState(journeyData.hasEmergencyFund ?? null)
  
  const monthlyExpenses = journeyData.monthlyExpenses || 0
  const minRecommended = monthlyExpenses * 3
  const maxRecommended = monthlyExpenses * 6

  const handleNext = () => {
    updateJourneyData('hasEmergencyFund', hasEmergencyFund)
    
    setTimeout(() => {
      nextStep()
    }, 50)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          Your Emergency Fund Goal
        </h1>
        <p className="text-lg text-primary-200 max-w-4xl mx-auto">
          Based on your monthly expenses
        </p>
      </div>

      <div className="bg-primary-100 rounded-xl shadow-xl p-8 md:p-12">
        
        {/* Recommendation */}
        <div className="bg-linear-to-r from-accent-purple-50 to-accent-purple-100 border-2 border-accent-purple-300 rounded-xl p-6 mb-8">
          <p className="text-accent-purple-900 font-semibold mb-2">
            Your monthly expenses: ${monthlyExpenses.toLocaleString()}
          </p>
          <p className="text-3xl font-bold text-accent-purple-900 mb-2">
            Common Guideline: ${minRecommended.toLocaleString()} - ${maxRecommended.toLocaleString()}
          </p>
          <p className="text-sm text-accent-purple-700">That's 3-6 months of expenses</p>
        </div>

        {/* Question */}
        <div className="mb-8">
          <label className="block text-xl font-semibold text-gray-900 mb-4">
            Do you already have a high-yield emergency fund saved?
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setHasEmergencyFund(true)}
              className={`w-full p-4 md:p-5 rounded-xl border-2 transition-all text-left ${
                hasEmergencyFund === true
                  ? 'border-accent-green-600 bg-accent-green-50 shadow-sm'
                  : 'border-primary-400 hover:border-primary-600 hover:bg-gray-100 bg-primary-50'
              }`}
            >
              <div className="font-semibold text-gray-900 mb-1">
                Yes
              </div>
              <div className="text-sm text-gray-600">
                I have 3-6 months saved or am actively saving in a high-yield or money market account
              </div>
            </button>

            <button
              onClick={() => setHasEmergencyFund(false)}
              className={`w-full p-4 md:p-5 rounded-xl border-2 transition-all text-left ${
                hasEmergencyFund === false
                  ? 'border-accent-green-600 bg-accent-green-50 shadow-sm'
                  : 'border-primary-400 hover:border-primary-600 hover:bg-gray-100 bg-primary-50'
              }`}
            >
              <div className="font-semibold text-gray-900 mb-1">
                No
              </div>
              <div className="text-sm text-gray-600">
                I need help setting one up or want to learn more
              </div>
            </button>

          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button onClick={prevStep} className="btn-journey-back">
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={hasEmergencyFund === null}
            className={`flex-1 ${
              hasEmergencyFund !== null ? 'btn-journey-next' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmergencyFundAmount