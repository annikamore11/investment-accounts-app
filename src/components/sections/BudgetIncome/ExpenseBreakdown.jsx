import React, { useState } from 'react'
import { House, Car, Utensils, ShieldPlus, Receipt, Film } from 'lucide-react'

const ExpenseBreakdown = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [expenses, setExpenses] = useState({
    rent: journeyData.expenseBreakdown?.rent || '',
    transportation: journeyData.expenseBreakdown?.transportation || '',
    food: journeyData.expenseBreakdown?.food || '',
    insurance: journeyData.expenseBreakdown?.insurance || '',
    utilities: journeyData.expenseBreakdown?.utilities || '',
    other: journeyData.expenseBreakdown?.other || '',
  })

  const total = Object.values(expenses).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)

  const handleExpenseChange = (field, value) => {
    const sanitized = value.replace(/[^\d.]/g, '')
    setExpenses({ ...expenses, [field]: sanitized })
  }

  const handleNext = () => {
    const breakdownData = {}
    Object.keys(expenses).forEach(key => {
      const value = parseFloat(expenses[key]) || 0
      if (value > 0) {
        breakdownData[key] = value
      }
    })
    
    // Save the breakdown object
    updateJourneyData('expenseBreakdown', breakdownData)
    
    // Update the total monthly expenses
    updateJourneyData('monthlyExpenses', total)
    
    setTimeout(() => {
      nextStep()
    }, 50)
  }

  const isComplete = expenses.rent || expenses.food // At least some expense

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          Break Down Your Expenses
        </h1>
        <p className="text-lg text-primary-200 max-w-4xl mx-auto">
          Estimate your major monthly expenses
        </p>
      </div>

      <div className="bg-primary-100 rounded-xl shadow-xl p-8 md:p-12">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Rent */}
          <div className="bg-white rounded-lg p-4 border-2 border-gray-300">
            <div className='flex space-x-2 mb-2'>
              <div className="flex-shrink-0 flex items-center justify-center">
                <House className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-center">
                <label className="block font-semibold text-gray-900">Rent/Mortgage</label>
              </div>
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

          {/* Car */}
          <div className="bg-white rounded-lg p-4 border-2 border-gray-300">
            <div className='flex space-x-2 mb-2'>
              <div className="flex-shrink-0 flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-center">
                <label className="block font-semibold text-gray-900">Car Payment</label>
              </div>
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
              <div className="flex-shrink-0 flex items-center justify-center">
                <Utensils className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-center">
                <label className="block font-semibold text-gray-900">Food and Groceries</label>
              </div>
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
              <div className="flex-shrink-0 flex items-center justify-center">
                <ShieldPlus className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-center">
                <label className="block font-semibold text-gray-900">Insurance</label>
              </div>
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
          </div>

          {/* Utilities */}
          <div className="bg-white rounded-lg p-4 border-2 border-gray-300">
            <div className='flex space-x-2 mb-2'>
              <div className="flex-shrink-0 flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-center">
                <label className="block font-semibold text-gray-900">Utilites, Bills, & Loans</label>
              </div>
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
              <div className="flex-shrink-0 flex items-center justify-center">
                <Film className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-center">
                <label className="block font-semibold text-gray-900">Everything Else</label>
              </div>
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
        {total > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-6 border-2 border-green-600">
            <div className="text-center">
              <p className="text-gray-700 mb-2">Your Estimated Monthly Total</p>
              <p className="text-4xl font-bold text-green-700">
                ${total.toLocaleString()}
              </p>
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

export default ExpenseBreakdown