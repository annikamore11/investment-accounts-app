import React, { useState, useEffect } from 'react'

const Budget = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [expenses, setExpenses] = useState({
    rent: journeyData.rent || '',
    carPayment: journeyData.carPayment || '',
    food: journeyData.food || '',
    insurance: journeyData.insurance || '',
    otherEssential: journeyData.otherEssential || '',
    nonEssential: journeyData.nonEssential || '',
  })

  const [showSummary, setShowSummary] = useState(false)

  // Calculate totals
  const essentialTotal = (
    parseFloat(expenses.rent || 0) +
    parseFloat(expenses.carPayment || 0) +
    parseFloat(expenses.food || 0) +
    parseFloat(expenses.insurance || 0) +
    parseFloat(expenses.otherEssential || 0)
  )

  const discretionaryTotal = parseFloat(expenses.nonEssential || 0)
  const monthlyTotal = essentialTotal + discretionaryTotal

  // Check if form is complete (at least rent and one other expense)
  const isComplete = expenses.rent && (
    expenses.carPayment || expenses.food || expenses.insurance || 
    expenses.otherEssential || expenses.nonEssential
  )

  const handleExpenseChange = (field, value) => {
    // Only allow numbers and decimals
    const sanitized = value.replace(/[^\d.]/g, '')
    setExpenses({ ...expenses, [field]: sanitized })
  }

  const handleNext = () => {
    // Save all expense data
    Object.keys(expenses).forEach(key => {
      updateJourneyData(key, expenses[key])
    })
    
    // Save calculated totals
    updateJourneyData('essentialTotal', essentialTotal)
    updateJourneyData('discretionaryTotal', discretionaryTotal)
    updateJourneyData('monthlyTotal', monthlyTotal)
    
    nextStep()
  }

  const handleShowSummary = () => {
    if (isComplete) {
      setShowSummary(true)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Everything starts with a budget (aka your lifestyle)
        </h2>
        <p className="text-gray-600 mb-8">
          Fill in the following expenses so we can map out a plan for you
        </p>

        {!showSummary ? (
          <>
            {/* Expense Inputs */}
            <div className="space-y-6 mb-8">
              {/* Rent/Mortgage */}
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  🏠 Rent or Mortgage
                </label>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-700 mr-2">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="1500"
                    value={expenses.rent}
                    onChange={(e) => handleExpenseChange('rent', e.target.value)}
                    className="flex-1 text-2xl font-bold p-3 border-2 border-gray-300 rounded-lg focus:border-accent-purple-500 focus:outline-none"
                  />
                  <span className="text-gray-600 ml-3">/month</span>
                </div>
              </div>

              {/* Car Payment */}
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  🚗 Car Payment
                </label>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-700 mr-2">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="350"
                    value={expenses.carPayment}
                    onChange={(e) => handleExpenseChange('carPayment', e.target.value)}
                    className="flex-1 text-2xl font-bold p-3 border-2 border-gray-300 rounded-lg focus:border-accent-purple-500 focus:outline-none"
                  />
                  <span className="text-gray-600 ml-3">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Leave blank if you don't have a car payment</p>
              </div>

              {/* Groceries/Food */}
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  🍕 Groceries & Food
                </label>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-700 mr-2">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="400"
                    value={expenses.food}
                    onChange={(e) => handleExpenseChange('food', e.target.value)}
                    className="flex-1 text-2xl font-bold p-3 border-2 border-gray-300 rounded-lg focus:border-accent-purple-500 focus:outline-none"
                  />
                  <span className="text-gray-600 ml-3">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Include groceries, restaurants, coffee, etc.</p>
              </div>

              {/* Insurance */}
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  🛡️ Insurance
                </label>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-700 mr-2">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="150"
                    value={expenses.insurance}
                    onChange={(e) => handleExpenseChange('insurance', e.target.value)}
                    className="flex-1 text-2xl font-bold p-3 border-2 border-gray-300 rounded-lg focus:border-accent-purple-500 focus:outline-none"
                  />
                  <span className="text-gray-600 ml-3">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Health, car, renters, etc.</p>
              </div>

              {/* Other Essential */}
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  📋 Other Essential Expenses
                </label>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-700 mr-2">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="200"
                    value={expenses.otherEssential}
                    onChange={(e) => handleExpenseChange('otherEssential', e.target.value)}
                    className="flex-1 text-2xl font-bold p-3 border-2 border-gray-300 rounded-lg focus:border-accent-purple-500 focus:outline-none"
                  />
                  <span className="text-gray-600 ml-3">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Utilities, internet, phone, subscriptions you need, etc.</p>
              </div>

              {/* Non-Essential */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-300">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  🎉 Non-Essential / Fun Money
                </label>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-700 mr-2">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="300"
                    value={expenses.nonEssential}
                    onChange={(e) => handleExpenseChange('nonEssential', e.target.value)}
                    className="flex-1 text-2xl font-bold p-3 border-2 border-purple-300 rounded-lg focus:border-accent-purple-500 focus:outline-none"
                  />
                  <span className="text-gray-600 ml-3">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Entertainment, shopping, hobbies, travel, etc.</p>
              </div>
            </div>

            {/* Preview totals */}
            {isComplete && (
              <div className="bg-gradient-to-r from-accent-purple-100 to-accent-green-100 rounded-xl p-6 mb-8 border-2 border-accent-purple-300">
                <div className="text-center mb-4">
                  <p className="text-lg font-semibold text-gray-900 mb-2">Quick Preview</p>
                  <div className="space-y-1 text-gray-700">
                    <p>Essential: <span className="font-bold">${essentialTotal.toLocaleString()}</span>/month</p>
                    <p>Discretionary: <span className="font-bold">${discretionaryTotal.toLocaleString()}</span>/month</p>
                    <p className="text-xl font-bold text-accent-purple-700 mt-2">
                      Total: ${monthlyTotal.toLocaleString()}/month
                    </p>
                  </div>
                </div>
                
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-4">
              <button
                onClick={prevStep}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={handleShowSummary}
                disabled={!isComplete}
                className={`flex-1 py-3 px-6 font-bold rounded-xl transition-all ${
                  isComplete
                    ? 'bg-accent-purple-600 hover:bg-accent-purple-700 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue →
              </button>
            </div>

            {!isComplete && (
              <p className="text-sm text-gray-500 text-center mt-4">
                Please fill in at least your rent and one other expense
              </p>
            )}
          </>
        ) : (
          /* Summary View */
          <>
            <div className="space-y-6 mb-8">
              {/* Essential Expenses Breakdown */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-300">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                  <span className="mr-2">✓</span> Your Essential Expenses
                </h3>
                <div className="space-y-2 text-gray-700">
                  {expenses.rent && (
                    <div className="flex justify-between">
                      <span>Rent/Mortgage</span>
                      <span className="font-semibold">${parseFloat(expenses.rent).toLocaleString()}</span>
                    </div>
                  )}
                  {expenses.carPayment && (
                    <div className="flex justify-between">
                      <span>Car Payment</span>
                      <span className="font-semibold">${parseFloat(expenses.carPayment).toLocaleString()}</span>
                    </div>
                  )}
                  {expenses.food && (
                    <div className="flex justify-between">
                      <span>Food & Groceries</span>
                      <span className="font-semibold">${parseFloat(expenses.food).toLocaleString()}</span>
                    </div>
                  )}
                  {expenses.insurance && (
                    <div className="flex justify-between">
                      <span>Insurance</span>
                      <span className="font-semibold">${parseFloat(expenses.insurance).toLocaleString()}</span>
                    </div>
                  )}
                  {expenses.otherEssential && (
                    <div className="flex justify-between">
                      <span>Other Essentials</span>
                      <span className="font-semibold">${parseFloat(expenses.otherEssential).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-blue-300 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold text-blue-900">
                      <span>Monthly Essential Total</span>
                      <span>${essentialTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Discretionary Expenses */}
              {expenses.nonEssential && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-300">
                  <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center">
                    <span className="mr-2">🎉</span> Your Discretionary Expenses
                  </h3>
                  <div className="flex justify-between text-lg font-bold text-purple-900">
                    <span>Fun Money</span>
                    <span>${discretionaryTotal.toLocaleString()}/month</span>
                  </div>
                </div>
              )}

              {/* Grand Total */}
              <div className="bg-gradient-to-r from-accent-purple-500 to-accent-purple-700 text-white rounded-xl p-8 text-center">
                <p className="text-lg mb-2 opacity-90">Your Total Monthly Expenses</p>
                <p className="text-5xl font-bold mb-4">${monthlyTotal.toLocaleString()}</p>
                <p className="opacity-90">per month</p>
              </div>

              {/* What's next teaser */}
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="font-bold text-yellow-900 mb-2">What's Next?</p>
                    <p className="text-yellow-800">
                      We'll use this info to help you figure out how much you can realistically save and invest. 
                      As we go through the next steps, we'll suggest specific dollar amounts for automatic savings!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowSummary(false)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                ← Edit Expenses
              </button>
              <button
                onClick={handleNext}
                className="flex-1 bg-accent-purple-600 hover:bg-accent-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                Looks Good! Continue →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Budget