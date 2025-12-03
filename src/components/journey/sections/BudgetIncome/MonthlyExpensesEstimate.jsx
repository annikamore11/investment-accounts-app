'use client'

import { useState } from 'react'
import { House, Car, Utensils, ShieldPlus, Receipt, Film } from 'lucide-react'
import StepContainer from '@/components/ui/StepContainer'
import OptionGrid from '@/components/ui/OptionGrid'
import StepNavigation from '@/components/ui/StepNavigation'
import DollarInput from '@/components/ui/DollarInput'
import useStepTransition from '@/hooks/useStepTransition'

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
  const { isExiting, transitionTo } = useStepTransition()

  const breakdownTotal = Object.values(expenses).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)

  const handleExpenseChange = (field, value) => {
    setExpenses({ ...expenses, [field]: value })
  }

  const handleNext = () => {
    if (needsHelp === true) {
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
    transitionTo(nextStep)
  }

  const isComplete = needsHelp !== null && (
    needsHelp === true
      ? (expenses.rent || expenses.food)
      : monthlyExpenses
  )

  const helpOptions = [
    { value: false, label: 'No, I know my total' },
    { value: true, label: 'Yes, help me calculate' }
  ]

  return (
    <StepContainer
      title="Monthly Expenses"
      subtitle="Let's get a sense of your spending. Don't worry about being exact!"
      isExiting={isExiting}
      exitDirection="horizontal"
    >
      {/* Need Help Question */}
      <div className="mb-8">
        <label className="block text-base sm:text-lg font-semibold text-primary-700 mb-4">
          Need help breaking down your expenses?
        </label>

        <OptionGrid
          options={helpOptions}
          selectedValue={needsHelp}
          onChange={setNeedsHelp}
        />
      </div>

      {/* Direct Input - Shows when needsHelp is false */}
      {needsHelp === false && (
        <div className="mb-8 animate-fadeIn">
          <label className="block text-base sm:text-lg font-semibold text-primary-700 mb-2">
            What are your total monthly expenses?
          </label>
          <p className="text-sm text-primary-600 mb-3">
            Don't include <strong>paycheck deductions</strong> like insurance or 401(k) contributions.
          </p>
          <DollarInput
            value={monthlyExpenses}
            onChange={setMonthlyExpenses}
            placeholder="3500"
          />
        </div>
      )}

      {/* Expense Breakdown - Shows when needsHelp is true */}
      {needsHelp === true && (
        <div className="mb-8 animate-fadeIn">
          <label className="block text-base sm:text-lg font-semibold text-primary-700 mb-2">
            Break down your major expenses:
          </label>
          <p className="text-sm text-primary-600 mb-3">
            Don't include <strong>paycheck deductions</strong> like 401(k) contributions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Rent */}
            <div className="bg-white rounded-lg p-4 border-2 border-primary-300 hover:border-accent-green-500 transition-colors">
              <div className='flex space-x-2 mb-2'>
                <House className="w-5 h-5 text-primary-700" />
                <label className="block font-semibold text-primary-900">Rent/Mortgage</label>
              </div>
              <DollarInput
                value={expenses.rent}
                onChange={(val) => handleExpenseChange('rent', val)}
                placeholder="1500"
                showCommas={false}
              />
            </div>

            {/* Car Payment */}
            <div className="bg-white rounded-lg p-4 border-2 border-primary-300 hover:border-accent-green-500 transition-colors">
              <div className='flex space-x-2 mb-2'>
                <Car className="w-5 h-5 text-primary-700" />
                <label className="block font-semibold text-primary-900">Car Payment</label>
              </div>
              <DollarInput
                value={expenses.carPayment}
                onChange={(val) => handleExpenseChange('carPayment', val)}
                placeholder="300"
                showCommas={false}
              />
            </div>

            {/* Food */}
            <div className="bg-white rounded-lg p-4 border-2 border-primary-300 hover:border-accent-green-500 transition-colors">
              <div className='flex space-x-2 mb-2'>
                <Utensils className="w-5 h-5 text-primary-700" />
                <label className="block font-semibold text-primary-900">Food & Groceries</label>
              </div>
              <DollarInput
                value={expenses.food}
                onChange={(val) => handleExpenseChange('food', val)}
                placeholder="400"
                showCommas={false}
              />
            </div>

            {/* Insurance */}
            <div className="bg-white rounded-lg p-4 border-2 border-primary-300 hover:border-accent-green-500 transition-colors">
              <div className='flex space-x-2 mb-2'>
                <ShieldPlus className="w-5 h-5 text-primary-700" />
                <label className="block font-semibold text-primary-900">Insurance</label>
              </div>
              <DollarInput
                value={expenses.insurance}
                onChange={(val) => handleExpenseChange('insurance', val)}
                placeholder="150"
                showCommas={false}
              />
              <p className="text-xs text-primary-500 mt-1">*Not taken out of paycheck</p>
            </div>

            {/* Utilities */}
            <div className="bg-white rounded-lg p-4 border-2 border-primary-300 hover:border-accent-green-500 transition-colors">
              <div className='flex space-x-2 mb-2'>
                <Receipt className="w-5 h-5 text-primary-700" />
                <label className="block font-semibold text-primary-900">Utilities & Bills</label>
              </div>
              <DollarInput
                value={expenses.utilities}
                onChange={(val) => handleExpenseChange('utilities', val)}
                placeholder="200"
                showCommas={false}
              />
              <p className="text-xs text-primary-500 mt-1">Electric, Phone, Internet, Student Loans</p>
            </div>

            {/* Other */}
            <div className="bg-white rounded-lg p-4 border-2 border-primary-300 hover:border-accent-green-500 transition-colors">
              <div className='flex space-x-2 mb-2'>
                <Film className="w-5 h-5 text-primary-700" />
                <label className="block font-semibold text-primary-900">Everything Else</label>
              </div>
              <DollarInput
                value={expenses.other}
                onChange={(val) => handleExpenseChange('other', val)}
                placeholder="300"
                showCommas={false}
              />
              <p className="text-xs text-primary-500 mt-1">Shopping, entertainment, hobbies</p>
            </div>
          </div>

          {/* Total */}
          {breakdownTotal > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 sm:p-6 border-2 border-accent-green-600 animate-fadeIn">
              <div className="text-center">
                <p className="text-primary-700 mb-2">Your Estimated Monthly Total</p>
                <p className="text-3xl sm:text-4xl font-bold text-accent-green-700">
                  ${breakdownTotal.toLocaleString()}
                </p>
              </div>
            </div>
          )}
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

export default MonthlyExpensesEstimate
