import React, { useState } from 'react'
import { DollarSign, HelpCircle, Check, House, Car, Utensils, ShieldPlus, Receipt, Film } from 'lucide-react'

const MonthlyExpensesEstimate = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [needsHelp, setNeedsHelp] = useState(journeyData.needsExpenseHelp ?? null)
  const [monthlyExpenses, setMonthlyExpenses] = useState(journeyData.monthlyExpenses || '')
  const [expenses, setExpenses] = useState({
    rent: journeyData.expenseBreakdown?.rent || '',
    carPayment: journeyData.expenseBreakdown?.carPayment || '',
    food: journeyData.expenseBreakdown?.food || '',
    insurance: journeyData.expenseBreakdown?.insurance || '',
    utilities: journeyData.expenseBreakdown?.utilities || '',
    other: journeyData.expenseBreakdown?.other || '',
  })

  const breakdownTotal = Object.values(expenses).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)

  const handleExpenseChange = (field, value) => {
    const sanitized = value.replace(/[^\d.]/g, '')
    setExpenses({ ...expenses, [field]: sanitized })
  }

  const handleNext = () => {
    if (needsHelp === true) {
      // Save breakdown
      const breakdownData = {}
      Object.keys(expenses).forEach(key => {
        const value = parseFloat(expenses[key]) || 0
        if (value > 0) {
          breakdownData[key] = value
        }
      })
      updateJourneyData('expenseBreakdown', breakdownData)
      updateJourneyData('monthlyExpenses', breakdownTotal)
    } else {
      // Save direct input
      setExpenses({
        rent: '',
        carPayment: '',
        food: '',
        insurance: '',
        utilities: '',
        other: '',
      })
      updateJourneyData('monthlyExpenses', monthlyExpenses)
    }
    
    updateJourneyData('needsExpenseHelp', needsHelp)
    
    setTimeout(() => {
      nextStep()
    }, 50)
  }

  const isComplete = needsHelp !== null && (
    needsHelp === true 
      ? (expenses.rent || expenses.food) // At least some expense in breakdown
      : monthlyExpenses // Direct input
  )

  return (
    <div className="w-full max-w-4xl mx-auto px-0 md:px-4">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-100 text-center mt-5 mb-6 lg:mb-10">
          Monthly Expenses
      </h1>
      <div className="md:bg-primary-100 md:rounded-xl md:shadow-xl md:p-4 lg:p-12">
        
        <p className="text-base md:text-lg text-primary-200 md:text-primary-700 max-w-4xl mx-auto text-center mb-6">
          Let's get a sense of your spending. Don't worry about being exact!
        </p>
        {/* Need Help Question */}
        <div className="mb-8">
          <label className="block text-base md:text-lg font-semibold text-primary-100 md:text-gray-900 mb-4">
            Need help breaking down your expenses?
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => {
                setNeedsHelp(false)
                // setMonthlyExpenses('')
              }}
              className={`flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all duration-200 text-left
                ${needsHelp === false
                  ? 'border-accent-green-600 bg-accent-green-50 shadow-sm'
                  : 'border-accent-green-600 hover:border-accent-gray-400 hover:bg-gray-100 bg-white'
                }`}
            >
              <div className="font-medium text-gray-900 mb-1">No</div>
            </button>

            <button
              onClick={() => {
                setNeedsHelp(true)
              }}
              className={`flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all duration-200 text-left
                ${needsHelp === true
                  ? 'border-accent-green-600 bg-accent-green-50 shadow-sm'
                  : 'border-accent-green-600 hover:border-accent-gray-400 hover:bg-gray-100 bg-white'
                }`}
            >
              <div className="font-medium text-gray-900 mb-1">Yes</div>
            </button>
          </div>
        </div>

        {/* Direct Input - Shows when needsHelp is false */}
        {needsHelp === false && (
          <div className="mb-8 animate-fadeIn">
            <label className="block text-base md:text-lg font-semibold text-primary-100 md:text-gray-900 mb-2">
              What are your total monthly expenses?
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Don't include <strong>paycheck deductions</strong> like insurance or 401(k) contributions.
            </p>
            <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-4 md:p-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl md:text-3xl font-bold text-gray-700">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="3500"
                  value={monthlyExpenses}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '')
                    setMonthlyExpenses(value)
                  }}
                  className="flex-1 min-w-0 text-2xl md:text-3xl font-bold p-2 md:p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none bg-white"
                />
                <span className="text-gray-600 text-sm md:text-base whitespace-nowrap">/month</span>
              </div>
            </div>
          </div>
        )}

        {/* Expense Breakdown - Shows when needsHelp is true */}
        {needsHelp === true && (
          <div className="mb-8 animate-fadeIn">
            <label className="block text-base md:text-lg font-semibold text-gray-900 mb-2">
              Break down your major expenses:
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Don't include <strong>paycheck deductions</strong> like 401(k) contributions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Rent */}
              <div className="bg-white rounded-lg p-4 border-2 border-gray-300">
                <div className='flex space-x-2 mb-2'>
                  <House className="w-5 h-5" />
                  <label className="block font-semibold text-gray-900">Rent/Mortgage</label>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-1">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1500"
                    value={expenses.rent}
                    onChange={(e) => handleExpenseChange('rent', e.target.value)}
                    className="w-full text-lg font-bold p-2 border-2 border-gray-300 rounded-lg focus:border-accent-green-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Car Payment */}
              <div className="bg-white rounded-lg p-4 border-2 border-gray-300">
                <div className='flex space-x-2 mb-2'>
                  <Car className="w-5 h-5" />
                  <label className="block font-semibold text-gray-900">Car Payment</label>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-1">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="300"
                    value={expenses.carPayment}
                    onChange={(e) => handleExpenseChange('carPayment', e.target.value)}
                    className="w-full text-lg font-bold p-2 border-2 border-gray-300 rounded-lg focus:border-accent-green-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Food */}
              <div className="bg-white rounded-lg p-4 border-2 border-gray-300">
                <div className='flex space-x-2 mb-2'>
                  <Utensils className="w-5 h-5" />
                  <label className="block font-semibold text-gray-900">Food & Groceries</label>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-1">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="400"
                    value={expenses.food}
                    onChange={(e) => handleExpenseChange('food', e.target.value)}
                    className="w-full text-lg font-bold p-2 border-2 border-gray-300 rounded-lg focus:border-accent-green-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Insurance */}
              <div className="bg-white rounded-lg p-4 border-2 border-gray-300">
                <div className='flex space-x-2 mb-2'>
                  <ShieldPlus className="w-5 h-5" />
                  <label className="block font-semibold text-gray-900">Insurance</label>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-1">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="150"
                    value={expenses.insurance}
                    onChange={(e) => handleExpenseChange('insurance', e.target.value)}
                    className="w-full text-lg font-bold p-2 border-2 border-gray-300 rounded-lg focus:border-accent-green-600 focus:outline-none"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">*Not taken out of paycheck</p>
              </div>

              {/* Utilities */}
              <div className="bg-white rounded-lg p-4 border-2 border-gray-300">
                <div className='flex space-x-2 mb-2'>
                  <Receipt className="w-5 h-5" />
                  <label className="block font-semibold text-gray-900">Utilities & Bills</label>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-1">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="200"
                    value={expenses.utilities}
                    onChange={(e) => handleExpenseChange('utilities', e.target.value)}
                    className="w-full text-lg font-bold p-2 border-2 border-gray-300 rounded-lg focus:border-accent-green-600 focus:outline-none"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Electric, Phone, Internet, Student Loans</p>
              </div>

              {/* Other */}
              <div className="bg-white rounded-lg p-4 border-2 border-gray-300">
                <div className='flex space-x-2 mb-2'>
                  <Film className="w-5 h-5" />
                  <label className="block font-semibold text-gray-900">Everything Else</label>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-1">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="300"
                    value={expenses.other}
                    onChange={(e) => handleExpenseChange('other', e.target.value)}
                    className="w-full text-lg font-bold p-2 border-2 border-gray-300 rounded-lg focus:border-accent-green-600 focus:outline-none"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Shopping, entertainment, hobbies</p>
              </div>
            </div>

            {/* Total */}
            {breakdownTotal > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 md:p-6 border-2 border-green-600">
                <div className="text-center">
                  <p className="text-gray-700 mb-2">Your Estimated Monthly Total</p>
                  <p className="text-3xl md:text-4xl font-bold text-green-700">
                    ${breakdownTotal.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
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
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default MonthlyExpensesEstimate