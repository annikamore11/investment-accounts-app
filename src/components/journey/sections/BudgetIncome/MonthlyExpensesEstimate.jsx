'use client'

import { useState } from 'react'
import { House, Car, Utensils, ShieldPlus, Receipt, Film } from 'lucide-react'
import StepContainer from '@/components/ui/StepContainer'
import OptionGrid from '@/components/ui/OptionGrid'
import StepNavigation from '@/components/ui/StepNavigation'
import DollarInput from '@/components/ui/DollarInput'
import useStepTransition from '@/hooks/useStepTransition'

// Drives both places the category grid appears (the "help me calculate"
// path, and the optional itemize toggle under "I know my total") from one
// list instead of two hand-duplicated sets of JSX.
const EXPENSE_CATEGORIES = [
  { key: 'rent', icon: House, label: 'Rent/Mortgage', placeholder: 'e.g. 1500' },
  {
    key: 'transportation',
    icon: Car,
    label: 'Transportation',
    placeholder: 'e.g. 300',
    caption: 'Gas, transit, parking — not a car loan payment',
  },
  { key: 'food', icon: Utensils, label: 'Food & Groceries', placeholder: 'e.g. 400' },
  {
    key: 'insurance',
    icon: ShieldPlus,
    label: 'Insurance',
    placeholder: 'e.g. 150',
    caption: '*Not taken out of paycheck',
  },
  {
    key: 'utilities',
    icon: Receipt,
    label: 'Utilities & Bills',
    placeholder: 'e.g. 200',
    caption: 'Electric, Phone, Internet',
  },
  {
    key: 'other',
    icon: Film,
    label: 'Everything Else',
    placeholder: 'e.g. 300',
    caption: 'Shopping, entertainment, hobbies',
  },
]

const ExpenseBreakdownGrid = ({ expenses, onChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
    {EXPENSE_CATEGORIES.map(({ key, icon: Icon, label, placeholder, caption }) => (
      <div
        key={key}
        className="min-w-0 bg-white rounded-lg p-4 border-2 border-primary-300 hover:border-accent-green-500 transition-colors"
      >
        <div className="flex space-x-2 mb-2">
          <Icon className="w-5 h-5 text-primary-700" />
          <label className="block font-semibold text-primary-900">{label}</label>
        </div>
        <DollarInput
          value={expenses[key]}
          onChange={(val) => onChange(key, val)}
          placeholder={placeholder}
          showCommas={false}
          compact
        />
        {caption && <p className="text-xs text-primary-500 mt-1">{caption}</p>}
      </div>
    ))}
  </div>
)

const MonthlyExpensesEstimate = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [needsHelp, setNeedsHelp] = useState(journeyData.needsExpenseHelp ?? null)
  const [monthlyExpenses, setMonthlyExpenses] = useState(journeyData.monthlyExpenses || '')
  const [expenses, setExpenses] = useState({
    rent: journeyData.expenseBreakdown?.rent || '',
    transportation: journeyData.expenseBreakdown?.transportation || '',
    food: journeyData.expenseBreakdown?.food || '',
    insurance: journeyData.expenseBreakdown?.insurance || '',
    utilities: journeyData.expenseBreakdown?.utilities || '',
    other: journeyData.expenseBreakdown?.other || '',
  })
  // Someone who already knows their total can still optionally itemize it —
  // purely additive (their stated total stays authoritative either way),
  // captured for a more personalized plan later. Starts open if they
  // already have breakdown data from a prior visit (e.g. they filled it in,
  // then went back and switched to "I know my total").
  const [showOptionalBreakdown, setShowOptionalBreakdown] = useState(
    () => Object.values(journeyData.expenseBreakdown || {}).some(Boolean)
  )
  const { isExiting, transitionTo } = useStepTransition()

  const breakdownTotal = Object.values(expenses).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)

  const handleExpenseChange = (field, value) => {
    setExpenses({ ...expenses, [field]: value })
  }

  const handleNext = () => {
    const breakdownData = {}
    Object.keys(expenses).forEach(key => {
      const value = parseFloat(expenses[key]) || 0
      if (value > 0) breakdownData[key] = value
    })
    updateJourneyData('expenseBreakdown', breakdownData)
    // needsHelp === true: the breakdown IS the total. needsHelp === false:
    // the typed total is authoritative even if they also itemized — a
    // rough optional breakdown isn't held to matching it exactly.
    updateJourneyData('monthlyExpenses', needsHelp === true ? breakdownTotal : monthlyExpenses)
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
            Don't include <strong>deductions</strong> like taxes or 401(k) contributions, or{' '}
            <strong>debt payments</strong> like credit cards, car loans, or student loans — we'll ask about those separately.
          </p>
          <DollarInput
            value={monthlyExpenses}
            onChange={setMonthlyExpenses}
            placeholder="3500"
          />

          <button
            type="button"
            onClick={() => setShowOptionalBreakdown(!showOptionalBreakdown)}
            className="mt-4 text-sm font-semibold text-accent-green-700 hover:text-accent-green-800 underline underline-offset-2"
          >
            {showOptionalBreakdown
              ? 'Hide the category breakdown'
              : 'Want to itemize where it goes? (optional, for a more personalized plan)'}
          </button>

          {showOptionalBreakdown && (
            <div className="mt-4 animate-fadeIn">
              <ExpenseBreakdownGrid expenses={expenses} onChange={handleExpenseChange} />
            </div>
          )}
        </div>
      )}

      {/* Expense Breakdown - Shows when needsHelp is true */}
      {needsHelp === true && (
        <div className="mb-8 animate-fadeIn">
          <label className="block text-base sm:text-lg font-semibold text-primary-700 mb-2">
            Break down your major expenses:
          </label>
          <p className="text-sm text-primary-600 mb-3">
            Don't include <strong>deductions</strong> like taxes or 401(k) contributions, or{' '}
            <strong>debt payments</strong> like credit cards, car loans, or student loans — we'll ask about those on the next page.
          </p>

          <ExpenseBreakdownGrid expenses={expenses} onChange={handleExpenseChange} />

          {/* Total */}
          {breakdownTotal > 0 && (
            <div className="bg-gradient-to-r from-accent-green-50 to-accent-green-100 rounded-xl p-4 sm:p-6 border-2 border-accent-green-600 animate-fadeIn">
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
