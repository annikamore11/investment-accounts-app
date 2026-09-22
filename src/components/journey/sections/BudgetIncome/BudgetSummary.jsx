'use client'

import { DollarSign, TrendingUp, Calendar, PiggyBank, Scale, HandCoins, CreditCard } from 'lucide-react'
import BudgetDonutChart from '@/components/charts/BudgetDonutChart'
import IncomeExpensesBar from '@/components/charts/IncomeExpensesBar'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'
import { getDebtMinPayments, getLeftover } from '@/utils/budgetMath'

const PAY_FREQUENCY_LABELS = {
  weekly: 'Weekly',
  biweekly: 'Every 2 weeks',
  semimonthly: 'Twice per month',
  monthly: 'Once per month',
  irregular: 'Irregular/Variable',
}

const BudgetSummary = ({ journeyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()
  const income = journeyData.monthlyIncome || 0
  const expenses = journeyData.monthlyExpenses || 0
  const taxes = journeyData.estimatedTaxDollarAmount || 0
  const netIncomeSelfEmployed = journeyData.netIncomeSelfEmployed || 0
  // Includes minimum debt payments, collected on their own step — see budgetMath.js
  const leftover = getLeftover(journeyData)
  const effectiveIncome = journeyData.employment === 'self-employed' ? netIncomeSelfEmployed : income
  const savingsRate = effectiveIncome > 0 ? ((leftover / effectiveIncome) * 100).toFixed(1) : 0

  const debts = journeyData.debts || []
  const totalDebt = debts.reduce((sum, d) => sum + (d.balance || 0), 0)
  const totalMinPayments = getDebtMinPayments(journeyData)

  return (
    <div className={`w-full max-w-6xl mx-auto transition-all duration-500 ${
      isExiting ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
    }`}>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        
        {/* Summary table */}
        <div className="bg-white rounded-xl shadow-xl p-4 border-2 border-primary-200">
          
          {/* Report Header */}
          <div className="border-b-2 border-primary-300 pb-3 mb-4">
            <h2 className="text-xl font-bold text-primary-900">Financial Summary</h2>
            <p className="text-xs text-primary-600 mt-1">Review your information</p>
          </div>

          {/* Summary Rows */}
          <div className="space-y-2">
            
            {/* Monthly Income */}
            <div className="grid grid-cols-3 py-3 border-b border-primary-200 hover:bg-primary-50 transition-colors">
              <div className="flex items-center space-x-2 col-span-2">
                <TrendingUp className="w-4 h-4 text-primary-500" />
                {journeyData.employment === 'self-employed' ? (
                  <span className="font-semibold text-primary-700 text-sm">Monthly Gross Income</span>
                ) : (
                  <span className="font-semibold text-primary-700 text-sm">Monthly Net Income</span>
                )}
              </div>
              <div className="text-right text-primary-900 font-bold text-base">
                ${income.toLocaleString()}
              </div>
            </div>

            {/* Estimated Taxes - Only show for self-employed */}
            {journeyData.employment === 'self-employed' && (
              <>
                <div className="grid grid-cols-3 py-4 border-b border-primary-200 hover:bg-primary-50 transition-colors">
                  <div className="flex items-center space-x-2 col-span-2">
                    <Scale className="w-4 h-4 text-rust-500" />
                    <span className="font-semibold text-primary-700 text-sm">Est. Taxes</span>
                  </div>
                  <div className="text-right text-rust-700 font-bold text-base">
                    -${taxes?.toLocaleString() || 0}
                  </div>
                </div>

                <div className="grid grid-cols-3 py-4 border-b border-primary-200 hover:bg-primary-50 transition-colors">
                  <div className="flex items-center space-x-2 col-span-2">
                    <HandCoins className="w-4 h-4 text-primary-500" />
                    <span className="font-semibold text-primary-700 text-sm">Net Income</span>
                  </div>
                  <div className="text-right text-primary-900 font-bold text-base">
                    ${netIncomeSelfEmployed?.toLocaleString() || 0}
                  </div>
                </div>
              </>
            )}

            {/* Monthly Expenses */}
            <div className="grid grid-cols-3 py-4 border-b border-primary-200 hover:bg-primary-50 transition-colors">
              <div className="flex items-center space-x-2 col-span-2">
                <DollarSign className="w-4 h-4 text-rust-500" />
                <span className="font-semibold text-primary-700 text-sm">Monthly Expenses</span>
              </div>
              <div className="text-right text-rust-700 font-bold text-base">
                -${expenses.toLocaleString()}
              </div>
            </div>

            {/* Debt - only shown if they reported any */}
            {journeyData.hasDebt && debts.length > 0 && (
              <div className="grid grid-cols-3 py-4 border-b border-primary-200 hover:bg-primary-50 transition-colors">
                <div className="flex items-center space-x-2 col-span-2">
                  <CreditCard className="w-4 h-4 text-rust-500" />
                  <span className="font-semibold text-primary-700 text-sm">Debt ({debts.length})</span>
                </div>
                <div className="text-right text-primary-900 font-bold text-base">
                  ${totalDebt.toLocaleString()}
                  <div className="text-xs font-normal text-primary-600">
                    ${totalMinPayments.toLocaleString()}/mo min. — counted below
                  </div>
                </div>
              </div>
            )}

            {/* Pay Frequency */}
            <div className="grid grid-cols-3 py-4 border-b border-primary-200 hover:bg-primary-50 transition-colors">
              <div className="flex items-center space-x-2 col-span-2">
                <Calendar className="w-4 h-4 text-primary-500" />
                <span className="font-semibold text-primary-700 text-sm">Pay Frequency</span>
              </div>
              <div className="text-right text-primary-900 text-sm">
                {PAY_FREQUENCY_LABELS[journeyData.payFrequency] || journeyData.payFrequency}
              </div>
            </div>

            {/* Leftover */}
            <div className={`grid grid-cols-3 py-4 border-b border-primary-200 ${
              leftover >= 0 ? 'bg-accent-green-50' : 'bg-rust-50'
            } transition-colors`}>
              <div className="flex items-center space-x-2 col-span-2">
                <PiggyBank className="w-4 h-4 text-primary-500" />
                <div>
                  <span className="font-semibold text-primary-700 text-sm">Available to Save Monthly</span>
                  {totalMinPayments > 0 && (
                    <p className="text-xs font-normal text-primary-500">After expenses & minimum debt payments</p>
                  )}
                </div>
              </div>
              <div className={`text-right font-bold text-base ${
                leftover >= 0 ? 'text-accent-green-700' : 'text-rust-700'
              }`}>
                {leftover >= 0 ? `$${leftover.toLocaleString()}` : `-$${Math.abs(leftover).toLocaleString()}`}
                <div className="text-xs font-normal">
                  ({savingsRate}%)
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-full">
          <IncomeExpensesBar journeyData={journeyData} />
        </div>

        <div className="h-full">
          <BudgetDonutChart journeyData={journeyData} />
        </div>
      </div>

      <StepNavigation
        onBack={prevStep}
        onNext={() => transitionTo(nextStep)}
        isExiting={isExiting}
        nextLabel="Continue to Next Section →"
        className="mt-4"
      />
    </div>
  )
}

export default BudgetSummary