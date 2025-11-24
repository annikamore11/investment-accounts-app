import React, { useState } from 'react'
import { DollarSign, HelpCircle, Check } from 'lucide-react'

const MonthlyExpensesEstimate = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [needsHelp, setNeedsHelp] = useState(journeyData.needsExpenseHelp ?? null)
  const [monthlyExpenses, setMonthlyExpenses] = useState(journeyData.monthlyExpenses || '')

  const handleNext = () => {
    updateJourneyData('monthlyExpenses', monthlyExpenses)
    updateJourneyData('needsExpenseHelp', needsHelp)
    
    setTimeout(() => {
      nextStep()
    }, 50)
  }

  const quickEstimates = [
    { value: 1000, label: '$1,000' },
    { value: 2000, label: '$2,000' },
    { value: 3000, label: '$3,000' },
    { value: 4000, label: '$4,000' },
  ]

  const isComplete = needsHelp !== null && (needsHelp === true || (needsHelp === false && monthlyExpenses))

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          Monthly Expenses
        </h1>
        <p className="text-lg text-primary-200 max-w-4xl mx-auto">
          Let's get a sense of your spending. Don't worry about being exact!
        </p>
      </div>

      <div className="bg-primary-100 rounded-xl shadow-xl p-8 md:p-12">

        {/* Need Help Question - FIRST */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-900 mb-4">
            Need help breaking down your expenses?
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => {
                setNeedsHelp(false)
                setMonthlyExpenses('') // Reset when changing
                updateJourneyData('needsExpenseHelp', false)
                updateJourneyData('monthlyExpenses', '')
              }}
              className={`w-full p-5 rounded-xl border-2 transition-all text-left flex items-start space-x-4 ${
                needsHelp === false
                  ? 'border-accent-green-600 bg-accent-green-50 shadow-sm'
                  : 'border-primary-400 hover:border-primary-600 hover:bg-gray-100 bg-primary-50'
              }`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                needsHelp === false
                  ? 'text-green-600 bg-accent-green-100'
                  : 'text-gray-600'
              }`}
              >
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">
                  No
                </div>
                <div className="text-sm text-gray-600">
                  I know my monthly expenses
                </div>
              </div>
              {needsHelp === false && (
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-accent-green-600" />
                </div>
              )}
            </button>

            <button
              onClick={() => {
                setNeedsHelp(true)
                setMonthlyExpenses('') // Reset when changing
                updateJourneyData('needsExpenseHelp', true)
                updateJourneyData('monthlyExpenses', '')
              }}
              className={`w-full p-5 rounded-xl border-2 transition-all text-left flex items-start space-x-4 ${
                needsHelp === true
                  ? 'border-accent-green-600 bg-accent-green-50 shadow-sm'
                  : 'border-primary-400 hover:border-primary-600 hover:bg-gray-100 bg-primary-50'
              }`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                needsHelp === true
                  ? 'text-green-600 bg-accent-green-100'
                  : 'text-gray-600'
              }`}
              >
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">
                  Yes
                </div>
                <div className="text-sm text-gray-600">
                  Help me estimate my expenses
                </div>
              </div>
              {needsHelp === true && (
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-accent-green-600" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Show input based on choice */}
        {needsHelp === false && (
          <div className="mb-8 animate-slideUp">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              What are your total monthly expenses?
            </label>
            <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-700 mr-2">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="3500"
                  value={monthlyExpenses}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '')
                    setMonthlyExpenses(value)
                  }}
                  className="flex-1 text-3xl font-bold p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none bg-white"
                />
                <span className="text-gray-600 ml-3">/month</span>
              </div>
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
            disabled={!isComplete}
            className={`flex-1 ${
              isComplete ? 'btn-journey-next' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

export default MonthlyExpensesEstimate