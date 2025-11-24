import React, { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, TriangleAlert, Info } from 'lucide-react'

const Income = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [income, setIncome] = useState(journeyData.monthlyIncome || 0)
  const [customIncome, setCustomIncome] = useState('')
  const [taxPercentage, setTaxPercentage] = useState(journeyData.estimatedTaxPercentage || 25)
  const [taxDollarAmount, setTaxDollarAmount] = useState(journeyData.estimatedTaxDollarAmount || '') // Add this new state
  
  const isSelfEmployed = journeyData.employment === 'self-employed'
  const displayIncome = customIncome || income

  // Sync tax dollar amount when income or tax percentage changes
  useEffect(() => {
    if (isSelfEmployed && taxPercentage && displayIncome > 0) {
      const calculatedAmount = Math.round(displayIncome * (taxPercentage / 100))
      setTaxDollarAmount(calculatedAmount.toString())
    }
  }, [displayIncome, taxPercentage, isSelfEmployed])

  const handleNext = () => {
    const finalIncome = customIncome || income
    updateJourneyData('monthlyIncome', finalIncome)
    
    if (isSelfEmployed) {
      updateJourneyData('estimatedTaxPercentage', taxPercentage)
      const calculatedTaxAmount= Math.round(finalIncome * (taxPercentage / 100))
      updateJourneyData('estimatedTaxDollarAmount', calculatedTaxAmount)
    }
    
    setTimeout(() => {
      nextStep()
    }, 50)
  }

  const handleSliderChange = (e) => {
    setIncome(parseInt(e.target.value))
    setCustomIncome('') // Clear custom when using slider
  }

  const handleCustomChange = (value) => {
    const sanitized = value.replace(/[^\d]/g, '')
    setCustomIncome(sanitized ? parseInt(sanitized) : '')
    if (sanitized) {
      setIncome(parseInt(sanitized))
    }
  }

  
  // Calculate after-tax income for self-employed
  const afterTaxIncome = isSelfEmployed 
    ? displayIncome * (1 - taxPercentage / 100)
    : displayIncome
  
  const taxAmount = isSelfEmployed ? displayIncome - afterTaxIncome : 0
  const leftover = afterTaxIncome - (journeyData.monthlyExpenses || 0)

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          Monthly Income
        </h1>
        <p className="text-lg text-primary-200 max-w-4xl mx-auto">
          {isSelfEmployed 
            ? "What's your approximate gross monthly income (before taxes)?"
            : "What's your take-home pay each month (after taxes)?"}
        </p>
      </div>

      <div className="bg-primary-100 rounded-xl shadow-xl p-8 md:p-12">
        
        {/* Info Box - Different for employed vs self-employed */}
        <div className="bg-accent-purple-50 border border-accent-purple-300 rounded-lg p-3 mb-6">
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 text-accent-purple-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-accent-purple-900">
              {isSelfEmployed ? (
                <>
                  <strong>Self-employed?</strong> Enter your gross income (before taxes). We'll help you estimate taxes in the next step. It's better to overestimate taxes than underestimate.
                </>
              ) : (
                <>
                  <strong>Use your take-home pay</strong> - the amount that actually hits your bank account after taxes are taken out.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Income Display */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-6 text-center border-2 border-accent-green-700">
          <p className="text-sm text-gray-700 mb-1">
            {isSelfEmployed ? 'Monthly Gross Income' : 'Monthly Take-Home Income'}
          </p>
          <p className="text-4xl font-bold text-green-700">
            ${displayIncome.toLocaleString()}
          </p>
        </div>

        {/* Slider */}
        <div className="mb-6">
          <label className="block text-base font-semibold text-gray-900 mb-3">
            Adjust with slider:
          </label>
          <input
            type="range"
            min="1000"
            max="15000"
            step="100"
            value={income}
            onChange={handleSliderChange}
            className="w-full h-2.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-accent-green-600"
            style={{
              background: `linear-gradient(to right, #16a34a 0%, #16a34a ${((income - 1000) / (15000 - 1000)) * 100}%, #d1d5db ${((income - 1000) / (15000 - 1000)) * 100}%, #d1d5db 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>$1,000</span>
            <span>$15,000+</span>
          </div>
        </div>

        {/* Custom Input */}
        <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-4 mb-6">
          <label className="block text-base font-semibold text-gray-900 mb-2">
            Or enter exact amount:
          </label>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-700 mr-2">$</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="4500"
              value={customIncome}
              onChange={(e) => handleCustomChange(e.target.value)}
              className="flex-1 text-2xl font-bold p-2 border-2 border-gray-300 rounded-lg focus:border-accent-green-600 focus:outline-none bg-white"
            />
            <span className="text-gray-600 ml-2">/month</span>
          </div>
        </div>

        {/* Self-Employed Tax Estimation */}
        {isSelfEmployed && (
          <div className="bg-accent-purple-50 border-2 border-accent-purple-300 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-3">Estimated Tax Percentage</h3>
            <p className="text-sm text-gray-700 mb-4">
              Self-employment taxes are typically 25-35% of your income (federal + state + self-employment tax). Choose a percentage to set aside for taxes.
            </p>
            
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={() => setTaxPercentage(25)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  taxPercentage === 25
                    ? 'border-accent-green-600 bg-accent-green-50 shadow-sm font-semibold'
                    : 'border-primary-400 hover:border-primary-600 hover:bg-gray-100 bg-primary-50'
                }`}
              >
                25%
              </button>
              <button
                onClick={() => setTaxPercentage(30)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  taxPercentage === 30
                    ? 'border-accent-green-600 bg-accent-green-50 shadow-sm font-semibold'
                    : 'border-primary-400 hover:border-primary-600 hover:bg-gray-100 bg-primary-50'
                }`}
              >
                30%
              </button>
              <button
                onClick={() => setTaxPercentage(35)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  taxPercentage === 35
                    ? 'border-accent-green-600 bg-accent-green-50 shadow-sm font-semibold'
                    : 'border-primary-400 hover:border-primary-600 hover:bg-gray-100 bg-primary-50'
                }`}
              >
                35%
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Or enter custom amount:
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Percentage Input */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Percentage</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="30"
                      value={taxPercentage}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, '')
                        if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
                          const newPercentage = value === '' ? '' : parseInt(value)
                          setTaxPercentage(newPercentage)
                          // Sync dollar amount
                          if (newPercentage && displayIncome > 0) {
                            setTaxDollarAmount(Math.round(displayIncome * (newPercentage / 100)).toString())
                          } else {
                            setTaxDollarAmount('')
                          }
                        }
                      }}
                      className="flex-1 text-xl font-bold p-2 border-2 border-gray-300 rounded-lg focus:border-accent-purple-500 focus:outline-none bg-white"
                    />
                    <span className="text-gray-600 ml-2 font-semibold">%</span>
                  </div>
                </div>

                {/* Dollar Amount Input */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Dollar Amount</label>
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-gray-700 mr-2">$</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder={Math.round(displayIncome * 0.3).toLocaleString()}
                      value={taxDollarAmount}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, '')
                        setTaxDollarAmount(value)
                        
                        if (value && displayIncome > 0) {
                          const dollarAmount = parseInt(value)
                          const percentage = Math.round((dollarAmount / displayIncome) * 100)
                          setTaxPercentage(Math.min(100, percentage))
                        } else if (value === '') {
                          setTaxPercentage('')
                        }
                      }}
                      className="flex-1 text-xl font-bold p-2 border-2 border-gray-300 rounded-lg focus:border-accent-purple-500 focus:outline-none bg-white"
                    />
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mt-2">
                Enter either percentage or dollar amount - they'll sync automatically
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-accent-purple-300">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Gross Income</p>
                  <p className="font-bold text-gray-900">${displayIncome.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Estimated Taxes ({taxPercentage}%)</p>
                  <p className="font-bold text-red-700">-${taxAmount.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                </div>
              </div>
              <div className="border-t border-gray-300 mt-3 pt-3">
                <p className="text-gray-600 text-sm mb-1">After-Tax Income</p>
                <p className="text-xl font-bold text-green-700">
                  ${afterTaxIncome.toLocaleString(undefined, {maximumFractionDigits: 0})}/month
                </p>
              </div>
            </div>

            <div className="mt-4 bg-green-50 border border-green-300 rounded-lg p-3">
              <p className="text-sm text-green-900">
                <strong>Pro tip:</strong> Keep your tax money in a money market fund (like SPAXX) so it earns ~5% interest while you wait to pay quarterly taxes. Free money!
              </p>
            </div>
          </div>
        )}

        {/* Leftover Preview */}
        {journeyData.monthlyExpenses && (
          <div className={`rounded-xl p-4 mb-6 border-2 ${
            leftover >= 0 
              ? 'bg-gradient-to-r from-green-50 to-green-100 border-accent-green-700' 
              : 'bg-red-50 border-red-300'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-700 mb-1">
                  After {isSelfEmployed && `taxes and `}expenses of ${journeyData.monthlyExpenses.toLocaleString()}
                </p>
                <p className="text-xl font-bold">
                  {leftover >= 0 ? (
                    <span className="text-accent-green-700">${leftover.toLocaleString(undefined, {maximumFractionDigits: 0})} left over</span>
                  ) : (
                    <span className="text-red-700">${Math.abs(leftover).toLocaleString(undefined, {maximumFractionDigits: 0})} short</span>
                  )}
                </p>
              </div>
              {leftover >= 0 ? (
                <div className="text-accent-green-700">
                  <DollarSign className="w-5 h-5"/>
                </div>
              ) : (
                <div className="text-red-700">
                  <TriangleAlert className="w-5 h-5"/>
                </div>
              )}
            </div>
            {leftover < 0 && (
              <p className="text-xs text-red-700 mt-2">
                {isSelfEmployed 
                  ? "You might want to revisit your expenses, tax estimate, or consider ways to increase income"
                  : "You might want to revisit your expenses or consider ways to increase income"}
              </p>
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
            className="flex-1 btn-journey-next"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

export default Income