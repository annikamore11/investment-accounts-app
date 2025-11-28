import React, { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, TriangleAlert, Info } from 'lucide-react'

const Income = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  // Pay frequency
  const [frequency, setFrequency] = useState(journeyData.payFrequency || '')
  
  // Income per paycheck
  const [paycheckAmount, setPaycheckAmount] = useState(journeyData.paycheckAmount || 0)
  const [customPaycheck, setCustomPaycheck] = useState('')
  
  // Tax info for self-employed
  const [taxPercentage, setTaxPercentage] = useState(journeyData.estimatedTaxPercentage || 25)
  const [taxDollarAmount, setTaxDollarAmount] = useState('')
  
  const isSelfEmployed = journeyData.employment === 'self-employed'
  const displayPaycheck = customPaycheck || paycheckAmount

  // Calculate monthly income based on frequency
  const getMonthlyIncome = () => {
    const multipliers = {
      'weekly': 4.33,
      'biweekly': 2.17,
      'semimonthly': 2,
      'monthly': 1,
      'irregular': 1 // User enters monthly estimate for irregular
    }
    return Math.round(displayPaycheck * (multipliers[frequency] || 1))
  }

  const monthlyIncome = getMonthlyIncome()

  // Calculate after-tax income for self-employed
  const afterTaxMonthly = isSelfEmployed 
    ? monthlyIncome * (1 - taxPercentage / 100)
    : monthlyIncome
  
  const taxAmount = isSelfEmployed ? monthlyIncome - afterTaxMonthly : 0
  const leftover = afterTaxMonthly - (journeyData.monthlyExpenses || 0)

  // Sync tax dollar amount when income or tax percentage changes
  useEffect(() => {
    if (isSelfEmployed && taxPercentage && monthlyIncome > 0) {
      const calculatedAmount = Math.round(monthlyIncome * (taxPercentage / 100))
      setTaxDollarAmount(calculatedAmount.toString())
    }
  }, [monthlyIncome, taxPercentage, isSelfEmployed])

  const handleNext = () => {
    updateJourneyData('payFrequency', frequency)
    updateJourneyData('paycheckAmount', displayPaycheck)
    updateJourneyData('monthlyIncome', monthlyIncome)
    
    if (isSelfEmployed) {
      updateJourneyData('estimatedTaxPercentage', taxPercentage)
      const calculatedTaxAmount = Math.round(monthlyIncome * (taxPercentage / 100))
      updateJourneyData('estimatedTaxDollarAmount', calculatedTaxAmount)
    }
    
    setTimeout(() => {
      nextStep()
    }, 50)
  }

  const handleSliderChange = (e) => {
    setPaycheckAmount(parseInt(e.target.value))
    setCustomPaycheck('')
  }

  const handleCustomChange = (value) => {
    const sanitized = value.replace(/[^\d]/g, '')
    setCustomPaycheck(sanitized ? parseInt(sanitized) : '')
    if (sanitized) {
      setPaycheckAmount(parseInt(sanitized))
    }
  }

  const frequencies = [
    { value: 'weekly', label: 'Weekly', description: 'Every week' },
    { value: 'biweekly', label: 'Bi-weekly', description: 'Every 2 weeks' },
    { value: 'semimonthly', label: 'Semi-monthly', description: 'Twice per month' },
    { value: 'monthly', label: 'Monthly', description: 'Once per month' },
    { value: 'irregular', label: 'Irregular', description: 'Estimate monthly' },
  ]

  const isComplete = frequency && displayPaycheck > 0

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-100 mb-3">
          Income & Pay Schedule
        </h1>
        <p className="text-base md:text-lg text-primary-200 max-w-4xl mx-auto">
          {isSelfEmployed 
            ? "Let's figure out your monthly income and set aside money for taxes"
            : "Tell us about your pay schedule so we can calculate monthly income"}
        </p>
      </div>

      <div className="bg-primary-100 rounded-xl shadow-xl p-4 md:p-8 lg:p-12">
        
        {/* Info Box */}
        <div className="bg-accent-purple-50 border border-accent-purple-300 rounded-lg p-3 mb-6">
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 text-accent-purple-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-accent-purple-900">
              {isSelfEmployed ? (
                <>
                  <strong>Self-employed?</strong> Enter your gross income per paycheck (before taxes). We'll calculate monthly and help you set aside for taxes.
                </>
              ) : (
                <>
                 <strong>Use your take-home pay</strong> - the amount that hits your bank account after taxes and deductions.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Step 1: Pay Frequency */}
        <div className="mb-8">
          <label className="block text-base md:text-lg font-semibold text-gray-900 mb-4">
            How often do you get paid?
          </label>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {frequencies.map(option => (
              <button
                key={option.value}
                onClick={() => setFrequency(option.value)}
                className={`p-3 md:p-4 rounded-xl border-2 transition-all text-center ${
                  frequency === option.value
                    ? 'border-accent-green-600 bg-accent-green-50 shadow-sm'
                    : 'border-primary-400 hover:border-primary-600 hover:bg-gray-100 bg-primary-50'
                }`}
              >
                <div className="font-bold text-gray-900 text-sm md:text-base mb-1">
                  {option.label}
                </div>
                <div className="text-xs text-gray-600 hidden md:block">
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Paycheck Amount (only show after frequency selected) */}
        {frequency && (
          <div className="mb-6 animate-fadeIn">
            <label className="block text-base md:text-lg font-semibold text-gray-900 mb-4">
              {frequency === 'irregular' 
                ? 'What do you estimate per month?' 
                : `How much per ${frequency === 'weekly' ? 'week' : frequency === 'biweekly' ? 'paycheck (every 2 weeks)' : frequency === 'semimonthly' ? 'paycheck (twice per month)' : 'month'}?`}
            </label>

            {/* Display Box */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 md:p-6 mb-4 text-center border-2 border-accent-green-700">
              <p className="text-xs md:text-sm text-gray-700 mb-1">
                {frequency === 'irregular' ? 'Monthly Estimate' : 'Per Paycheck'}
              </p>
              <p className="text-3xl md:text-4xl font-bold text-green-700">
                ${displayPaycheck.toLocaleString()}
              </p>
              
              {frequency !== 'irregular' && monthlyIncome !== displayPaycheck && (
                <p className="text-xs md:text-sm text-gray-600 mt-2">
                  ≈ ${monthlyIncome.toLocaleString()}/month
                </p>
              )}
            </div>

            {/* Slider */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Adjust with slider:
              </label>
              <input
                type="range"
                min="500"
                max="10000"
                step="50"
                value={paycheckAmount}
                onChange={handleSliderChange}
                className="w-full h-2.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-accent-green-600"
                style={{
                  background: `linear-gradient(to right, #16a34a 0%, #16a34a ${((paycheckAmount - 500) / (10000 - 500)) * 100}%, #d1d5db ${((paycheckAmount - 500) / (10000 - 500)) * 100}%, #d1d5db 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>$500</span>
                <span>$10,000+</span>
              </div>
            </div>

            {/* Custom Input */}
            <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Or enter exact amount:
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-bold text-gray-700">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="2500"
                  value={customPaycheck}
                  onChange={(e) => handleCustomChange(e.target.value)}
                  className="flex-1 min-w-0 text-xl md:text-2xl font-bold p-2 border-2 border-gray-300 rounded-lg focus:border-accent-green-600 focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Self-Employed Tax Estimation */}
        {isSelfEmployed && frequency && displayPaycheck > 0 && (
          <div className="bg-accent-purple-50 border-2 border-accent-purple-300 rounded-xl p-4 md:p-6 mb-6 animate-fadeIn">
            <h3 className="font-bold text-gray-900 mb-3">Estimated Tax Percentage</h3>
            <p className="text-sm text-gray-700 mb-4">
              Self-employment taxes are typically 25-35% of your income. Choose the percentage you set aside.
            </p>
            
            <div className="flex items-center gap-2 md:gap-4 mb-6">
              {[25, 30, 35].map(percent => (
                <button
                  key={percent}
                  onClick={() => setTaxPercentage(percent)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    taxPercentage === percent
                      ? 'border-accent-green-600 bg-accent-green-50 shadow-sm font-semibold'
                      : 'border-primary-400 hover:border-primary-600 hover:bg-gray-100 bg-primary-50'
                  }`}
                >
                  {percent}%
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Or enter custom percentage:
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="30"
                  value={taxPercentage}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '')
                    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
                      setTaxPercentage(value === '' ? '' : parseInt(value))
                    }
                  }}
                  className="flex-1 text-xl font-bold p-2 border-2 border-gray-300 rounded-lg focus:border-accent-purple-500 focus:outline-none bg-white"
                />
                <span className="text-gray-600 ml-2 font-semibold">%</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-accent-purple-300">
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <p className="text-gray-600 mb-1">Monthly Gross</p>
                  <p className="font-bold text-gray-900">${monthlyIncome.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Taxes ({taxPercentage}%)</p>
                  <p className="font-bold text-red-700">-${taxAmount.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                </div>
              </div>
              <div className="border-t border-gray-300 pt-3">
                <p className="text-gray-600 text-sm mb-1">After-Tax Monthly</p>
                <p className="text-xl font-bold text-green-700">
                  ${afterTaxMonthly.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Leftover Preview */}
        {journeyData.monthlyExpenses && frequency && displayPaycheck > 0 && (
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
                    <span className="text-accent-green-700">${leftover.toLocaleString(undefined, {maximumFractionDigits: 0})} left over per month</span>
                  ) : (
                    <span className="text-red-700">${Math.abs(leftover).toLocaleString(undefined, {maximumFractionDigits: 0})} short per month</span>
                  )}
                </p>
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

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 3000px;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default Income