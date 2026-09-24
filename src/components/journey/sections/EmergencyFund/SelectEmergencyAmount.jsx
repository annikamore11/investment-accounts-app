'use client'

import { useState } from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import InfoBox from '@/components/ui/InfoBox'
import useStepTransition from '@/hooks/useStepTransition'
import { getTotalExpenses, getLeftover } from '@/utils/budgetMath'

const digitsOnly = (value) => value.replace(/[^\d]/g, '')

// Runs before we ask whether they already have a fund, so the goal and
// guideline apply to everyone — the "already have one" summary needs a real
// goal to show progress against, not just a generic 3-6 month range.
const SelectEmergencyAmount = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()
  const [selectedAmount, setSelectedAmount] = useState(journeyData.emergencyFundGoal || '')
  const [currentSavings, setCurrentSavings] = useState(
    journeyData.emergencyFundCurrentAmount ? String(journeyData.emergencyFundCurrentAmount) : ''
  )
  // Not a selection/answer — just toggles the explanation below. "I don't
  // know" shouldn't end the question, it should help them find the number.
  const [showSavingsHelp, setShowSavingsHelp] = useState(false)

  // Expenses plus debt minimum payments — same "total monthly outflow"
  // basis used everywhere else in the app, not just the Expenses step's own
  // number.
  const monthlyExpenses = getTotalExpenses(journeyData)
  const minRecommended = monthlyExpenses * 3
  const maxRecommended = monthlyExpenses * 6
  const leftover = getLeftover(journeyData)

  const goalAmount = parseFloat(selectedAmount) || 0
  const savedAmount = parseFloat(currentSavings) || 0
  const progressPercentage = goalAmount > 0 ? Math.min((savedAmount / goalAmount) * 100, 100) : 0

  const presetAmounts = [
    { value: monthlyExpenses * 3, label: `$${(monthlyExpenses * 3).toLocaleString()}`, months: '3 months' },
    { value: monthlyExpenses * 4, label: `$${(monthlyExpenses * 4).toLocaleString()}`, months: '4 months' },
    { value: monthlyExpenses * 5, label: `$${(monthlyExpenses * 5).toLocaleString()}`, months: '5 months' },
    { value: monthlyExpenses * 6, label: `$${(monthlyExpenses * 6).toLocaleString()}`, months: '6 months' },
  ]

  const handleNext = () => {
    updateJourneyData('emergencyFundGoal', goalAmount)
    updateJourneyData('emergencyFundCurrentAmount', savedAmount)
    transitionTo(nextStep)
  }

  return (
    <StepContainer
      title="Your Emergency Fund Goal"
      subtitle="Based on your monthly expenses + debt payments"
      isExiting={isExiting}
    >
      {/* Guideline — same green "calculated result" treatment used
          everywhere else in this flow (not amber, which is reserved for
          the current-position marker and primary actions). */}
      <div className="bg-gradient-to-r from-accent-green-50 to-accent-green-100 border-2 border-accent-green-600 rounded-xl p-6 mb-6">
        <p className="text-accent-green-900 font-semibold mb-2">
          Your monthly expenses + debt payments: ${monthlyExpenses.toLocaleString()}
        </p>
        <p className="text-3xl font-bold text-accent-green-900 mb-2">
          Common Guideline: ${minRecommended.toLocaleString()} - ${maxRecommended.toLocaleString()}
        </p>
        <p className="text-sm text-accent-green-700">That's 3-6 months of expenses</p>
      </div>

      <InfoBox
        title="Don't worry!"
        message="You don't need this saved today — it's a target to build toward over time. We'll help you make steady progress here while still paying down debt and covering your other goals along the way, not put everything else on hold for it."
      />

      {/* Preset Options */}
      <div className="mb-6">
        {monthlyExpenses !== 0 ? (
          <>
            <label className="block text-base md:text-lg font-semibold text-primary-900 mb-4">
              Select a target amount:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {presetAmounts.map(option => (
                <button
                  key={option.value}
                  onClick={() => setSelectedAmount(option.value)}
                  className={`p-3 md:p-4 rounded-lg border-2 transition-all ${
                    selectedAmount === option.value
                      ? 'border-accent-green-600 bg-accent-green-50 shadow-md'
                      : 'border-primary-300 hover:border-primary-400 bg-white'
                  }`}
                >
                  <p className="text-lg md:text-xl font-bold text-primary-900">{option.label}</p>
                  <p className="text-xs text-primary-600 mt-1">{option.months}</p>
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* Custom Amount */}
      <div className="bg-primary-50 border-2 border-primary-300 rounded-xl p-4 md:p-6 mb-6">
        <label className="block text-base md:text-lg font-semibold text-primary-900 mb-3">
          {monthlyExpenses === 0 ? 'Enter your goal:' : 'Or enter your own goal:'}
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xl md:text-2xl font-bold text-primary-700">$</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="15000"
            value={typeof selectedAmount === 'number' && !presetAmounts.some(a => a.value === selectedAmount) ? selectedAmount : ''}
            onChange={(e) => {
              const value = e.target.value.replace(/[^\d]/g, '')
              setSelectedAmount(value ? parseInt(value) : '')
            }}
            className="flex-1 min-w-0 text-xl md:text-2xl font-bold p-2 md:p-3 border-2 border-primary-300 rounded-lg focus:border-accent-green-600 focus:outline-none bg-white"
          />
        </div>
      </div>

      {/* Current Savings — asked here, before we know whether they already
          have a fund, so the copy has to work for both "I have some of this
          already" and "starting from zero." */}
      {selectedAmount > 0 && (
        <div className="mb-6 animate-fadeIn">
          <label className="block text-base md:text-lg font-semibold text-primary-900 mb-3">
            How much do you have saved or money you could add right now?
          </label>
          <p className="text-sm text-primary-600 mb-3">
            It's okay if the answer is $0 — that's a starting point, not a problem.
          </p>
          <div className="bg-primary-50 border-2 border-primary-300 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold text-primary-700">$</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(digitsOnly(e.target.value))}
                className="flex-1 min-w-0 text-xl md:text-2xl font-bold p-2 md:p-3 border-2 border-primary-300 rounded-lg focus:border-accent-green-600 focus:outline-none bg-white"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSavingsHelp(!showSavingsHelp)}
            className="mt-3 text-sm font-semibold text-accent-green-700 hover:text-accent-green-800 underline underline-offset-2"
          >
            {showSavingsHelp ? 'Hide help' : "Not sure? Here's how to find out"}
          </button>

          {showSavingsHelp && (
            <div className="mt-3 bg-primary-50 border border-primary-300 rounded-lg p-4 text-sm text-primary-700 animate-fadeIn">
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  For what you already have saved, check the balance of any savings or checking account you'd
                  set this money aside in.
                </li>
                <li>
                  {leftover > 0
                    ? `For what you could add right now: based on your budget, you have about $${leftover.toLocaleString()} left over each month after expenses and debt payments — that's a reasonable amount to start with.`
                    : "For what you could add right now, look at what's left after this month's bills — even a small amount is a fine place to start, and $0 is a completely valid answer too."}
                </li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      {goalAmount > 0 && currentSavings !== '' && (
        <div className="mb-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-primary-700">Progress to Goal</span>
            <span className="text-sm font-bold text-accent-green-700">
              {progressPercentage.toFixed(0)}%
            </span>
          </div>

          <div className="w-full bg-primary-300 rounded-full h-3 mb-2 overflow-hidden">
            <div
              className="bg-accent-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-primary-700">
            <span>${savedAmount.toLocaleString()} saved</span>
            <span>${goalAmount.toLocaleString()} goal</span>
          </div>

          {savedAmount < goalAmount ? (
            <p className="text-xs text-primary-600 mt-2 text-center">
              ${(goalAmount - savedAmount).toLocaleString()} left to reach your goal
            </p>
          ) : (
            <p className="text-sm text-accent-green-700 font-semibold mt-2 text-center">
              🎉 You've reached your goal!
            </p>
          )}
        </div>
      )}

      <StepNavigation
        onBack={prevStep}
        onNext={handleNext}
        canGoNext={!!selectedAmount}
        isExiting={isExiting}
      />

      {!selectedAmount && (
        <p className="text-sm text-primary-500 text-center mt-4 animate-fadeIn">
          Please select your amount to continue
        </p>
      )}
    </StepContainer>
  )
}

export default SelectEmergencyAmount
