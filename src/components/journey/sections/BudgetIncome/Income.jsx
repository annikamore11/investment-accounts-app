'use client'

import { useState } from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import InfoBox from '@/components/ui/InfoBox'
import useStepTransition from '@/hooks/useStepTransition'
import { getDebtMinPayments } from '@/utils/budgetMath'

const PAYCHECKS_PER_MONTH = {
  weekly: 4.33,
  biweekly: 2.17,
  semimonthly: 2,
  monthly: 1,
  irregular: 1,
}

const Income = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [frequency, setFrequency] = useState(journeyData.payFrequency || '')
  const [paycheckAmount, setPaycheckAmount] = useState(journeyData.paycheckAmount || 0)
  const [customPaycheck, setCustomPaycheck] = useState('')
  const [taxPercentage, setTaxPercentage] = useState(journeyData.estimatedTaxPercentage || 25)
  const { isExiting, transitionTo } = useStepTransition()

  const isSelfEmployed = journeyData.employment === 'self-employed'
  const displayPaycheck = customPaycheck || paycheckAmount

  const monthlyIncome = Math.round(displayPaycheck * (PAYCHECKS_PER_MONTH[frequency] || 1))
  const afterTaxMonthly = isSelfEmployed
    ? monthlyIncome * (1 - taxPercentage / 100)
    : monthlyIncome
  const taxAmount = isSelfEmployed ? monthlyIncome - afterTaxMonthly : 0
  const debtMinPayments = getDebtMinPayments(journeyData)
  const totalExpenses = (journeyData.monthlyExpenses || 0) + debtMinPayments
  const leftover = afterTaxMonthly - totalExpenses

  const handleNext = () => {
    updateJourneyData('payFrequency', frequency)
    updateJourneyData('paycheckAmount', displayPaycheck)
    updateJourneyData('monthlyIncome', monthlyIncome)

    if (isSelfEmployed) {
      updateJourneyData('estimatedTaxPercentage', taxPercentage)
      updateJourneyData('estimatedTaxDollarAmount', Math.round(taxAmount))
      updateJourneyData('netIncomeSelfEmployed', afterTaxMonthly)
    }

    transitionTo(nextStep)
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
    <StepContainer
      title="Income & Pay Schedule"
      subtitle={isSelfEmployed
        ? "Let's figure out your monthly income and set aside money for taxes"
        : "Tell us about your pay schedule so we can calculate monthly income"}
      isExiting={isExiting}
    >
      
      {/* Pay Frequency */}
      <div className="mb-8">
        <label className="block text-base sm:text-lg font-semibold text-primary-700 mb-4">
          How often do you get paid?
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {frequencies.map(option => (
            <button
              key={option.value}
              onClick={() => setFrequency(option.value)}
              className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 text-center ${
                frequency === option.value
                  ? 'border-accent-green-600 bg-accent-green-50 shadow-lg scale-105'
                  : 'border-primary-400 hover:border-primary-600 hover:bg-white bg-primary-50 hover:shadow-md hover:scale-102'
              }`}
            >
              <div className="font-bold text-primary-900 text-sm sm:text-base mb-1">
                {option.label}
              </div>
              <div className="text-xs text-primary-600 hidden md:block">
                {option.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Paycheck Amount */}
      {frequency && (
        <div className="mb-6 animate-fadeIn">
          <label className="block text-base sm:text-lg font-semibold text-primary-700 mb-4">
            {journeyData.employment === 'self-employed'
              ? 'How much gross per paycheck (before taxes and deductions)?'
              : frequency === 'irregular'
              ? 'What income do you estimate per month (after deductions like taxes)?'
              : 'How much net per paycheck (after deductions like taxes)?'}
          </label>

          {/* Display Box */}
          <div className="bg-gradient-to-r from-accent-green-50 to-accent-green-100 rounded-xl p-4 sm:p-6 mb-4 text-center border-2 border-accent-green-700">
            <p className="text-xs sm:text-sm text-primary-700 mb-1">
              {frequency === 'irregular' ? 'Monthly Estimate' : 'Per Paycheck'}
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-accent-green-700">
              ${displayPaycheck.toLocaleString()}
            </p>

            {frequency !== 'irregular' && monthlyIncome !== displayPaycheck && (
              <p className="text-xs sm:text-sm text-primary-600 mt-2">
                ≈ ${monthlyIncome.toLocaleString()}/month
              </p>
            )}
          </div>

          {/* Custom Input */}
          <div className="bg-primary-50 border-2 border-primary-300 rounded-xl p-4">
            <label className="block text-sm font-semibold text-primary-700 mb-2">
              Enter amount:
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold text-primary-700">$</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="2500"
                value={customPaycheck}
                onChange={(e) => handleCustomChange(e.target.value)}
                className="flex-1 min-w-0 text-xl sm:text-2xl font-bold p-2 border-2 border-primary-300 rounded-lg focus:border-accent-green-600 focus:outline-none bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Self-Employed Tax Estimation */}
      {isSelfEmployed && frequency && displayPaycheck > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 sm:p-6 mb-6 animate-fadeIn">
          <h3 className="font-bold text-primary-900 mb-3">Estimated Tax Percentage</h3>
          <p className="text-sm text-primary-700 mb-4">
            Self-employment taxes are typically 25-35% of your income. Choose the percentage you set aside.
          </p>

          <div className="flex items-center gap-2 sm:gap-4 mb-6">
            {[25, 30, 35].map(percent => (
              <button
                key={percent}
                onClick={() => setTaxPercentage(percent)}
                className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                  taxPercentage === percent
                    ? 'border-accent-green-600 bg-accent-green-50 shadow-lg scale-105 font-semibold'
                    : 'border-primary-400 hover:border-primary-600 hover:bg-white bg-primary-50 hover:shadow-md hover:scale-102'
                }`}
              >
                {percent}%
              </button>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-primary-700 mb-2">
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
                className="flex-1 text-xl font-bold p-2 border-2 border-primary-300 rounded-lg focus:border-amber-500 focus:outline-none bg-white"
              />
              <span className="text-primary-600 ml-2 font-semibold">%</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-amber-300">
            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div>
                <p className="text-primary-600 mb-1">Monthly Gross</p>
                <p className="font-bold text-primary-900">${monthlyIncome.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-primary-600 mb-1">Taxes ({taxPercentage}%)</p>
                <p className="font-bold text-rust-700">-${taxAmount.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
              </div>
            </div>
            <div className="border-t border-primary-300 pt-3">
              <p className="text-primary-600 text-sm mb-1">After-Tax Monthly</p>
              <p className="text-xl font-bold text-accent-green-700">
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
            ? 'bg-gradient-to-r from-accent-green-50 to-accent-green-100 border-accent-green-700'
            : 'bg-rust-50 border-rust-300'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-primary-700 mb-1">
                After {isSelfEmployed && `taxes and `}expenses{debtMinPayments > 0 ? ' & minimum debt payments' : ''} of ${totalExpenses.toLocaleString()}
              </p>
              <p className="text-xl font-bold">
                {leftover >= 0 ? (
                  <span className="text-accent-green-700">${leftover.toLocaleString(undefined, {maximumFractionDigits: 0})} left over per month</span>
                ) : (
                  <span className="text-rust-700">${Math.abs(leftover).toLocaleString(undefined, {maximumFractionDigits: 0})} short per month</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      <StepNavigation
        onBack={prevStep}
        onNext={handleNext}
        canGoNext={isComplete}
        isExiting={isExiting}
      />
    </StepContainer>
  )
}

export default Income
