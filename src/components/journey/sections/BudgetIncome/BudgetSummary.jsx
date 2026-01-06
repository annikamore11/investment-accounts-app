import React, {useState} from 'react'
import { DollarSign, TrendingUp, Calendar, PiggyBank, Scale, HandCoins } from 'lucide-react'
import BudgetDonutChart from '@/components/charts/BudgetDonutChart'
import IncomeExpensesBar from '@/components/charts/IncomeExpensesBar' 

const BudgetSummary = ({ journeyData, nextStep, prevStep }) => {
  const [isExiting, setIsExiting] = useState(false)
  const income = journeyData.monthlyIncome || 0
  const expenses = journeyData.monthlyExpenses || 0
  const taxes = journeyData.estimatedTaxDollarAmount || 0
  const netIncomeSelfEmployed = journeyData.netIncomeSelfEmployed || 0
  const leftover = journeyData.employment === 'self-employed' 
    ? netIncomeSelfEmployed - expenses 
    : income - expenses
  const savingsRate = income > 0 ? ((leftover / income) * 100).toFixed(1) : 0

  const getFrequencyLabel = (freq) => {
    const labels = {
      'weekly': 'Weekly',
      'biweekly': 'Every 2 weeks',
      'semimonthly': 'Twice per month',
      'monthly': 'Once per month',
      'irregular': 'Irregular/Variable'
    }
    return labels[freq] || freq
  }

  const handleNext = () => {
    setIsExiting(true)
    setTimeout(() => {
      nextStep()
    }, 500)
  }

  return (
    <div className={`w-full max-w-6xl mx-auto transition-all duration-500 ${
      isExiting ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
    }`}>
      
      {/* Remove auto-rows-fr, use items-start instead */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        
        {/* Left Column - Summary Table - Natural height, sets the standard */}
        <div className="bg-white rounded-xl shadow-xl p-4 border-2 border-gray-200">
          
          {/* Report Header */}
          <div className="border-b-2 border-gray-300 pb-3 mb-4">
            <h2 className="text-xl font-bold text-gray-900">Financial Summary</h2>
            <p className="text-xs text-gray-600 mt-1">Review your information</p>
          </div>

          {/* Summary Rows */}
          <div className="space-y-2">
            
            {/* Monthly Income */}
            <div className="grid grid-cols-3 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-2 col-span-2">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                {journeyData.employment === 'self-employed' ? (
                  <span className="font-semibold text-gray-700 text-sm">Monthly Gross Income</span>
                ) : (
                  <span className="font-semibold text-gray-700 text-sm">Monthly Net Income</span>
                )}
              </div>
              <div className="text-right text-gray-900 font-bold text-base">
                ${income.toLocaleString()}
              </div>
            </div>

            {/* Estimated Taxes - Only show for self-employed */}
            {journeyData.employment === 'self-employed' && (
              <>
                <div className="grid grid-cols-3 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-2 col-span-2">
                    <Scale className="w-4 h-4 text-red-500" />
                    <span className="font-semibold text-gray-700 text-sm">Est. Taxes</span>
                  </div>
                  <div className="text-right text-red-700 font-bold text-base">
                    -${taxes?.toLocaleString() || 0}
                  </div>
                </div>

                <div className="grid grid-cols-3 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-2 col-span-2">
                    <HandCoins className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-700 text-sm">Net Income</span>
                  </div>
                  <div className="text-right text-gray-900 font-bold text-base">
                    ${netIncomeSelfEmployed?.toLocaleString() || 0}
                  </div>
                </div>
              </>
            )}

            {/* Monthly Expenses */}
            <div className="grid grid-cols-3 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-2 col-span-2">
                <DollarSign className="w-4 h-4 text-red-500" />
                <span className="font-semibold text-gray-700 text-sm">Monthly Expenses</span>
              </div>
              <div className="text-right text-red-700 font-bold text-base">
                -${expenses.toLocaleString()}
              </div>
            </div>

            {/* Pay Frequency */}
            <div className="grid grid-cols-3 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-2 col-span-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-gray-700 text-sm">Pay Frequency</span>
              </div>
              <div className="text-right text-gray-900 text-sm">
                {getFrequencyLabel(journeyData.payFrequency)}
              </div>
            </div>

            {/* Leftover */}
            <div className={`grid grid-cols-3 py-4 border-b border-gray-200 ${
              leftover >= 0 ? 'bg-green-50' : 'bg-red-50'
            } transition-colors`}>
              <div className="flex items-center space-x-2 col-span-2">
                <PiggyBank className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-gray-700 text-sm">Available to Save Monthly</span>
              </div>
              <div className={`text-right font-bold text-base ${
                leftover >= 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                {leftover >= 0 ? `$${leftover.toLocaleString()}` : `-$${Math.abs(leftover).toLocaleString()}`}
                <div className="text-xs font-normal">
                  ({savingsRate}%)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - Income vs Expenses Bar - Stretches to match left */}
        <div className="h-full">
          <IncomeExpensesBar journeyData={journeyData} />
        </div>

        {/* Right Column - Expense Breakdown Donut - Stretches to match left */}
        <div className="h-full">
          <BudgetDonutChart journeyData={journeyData} />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-4">
        <button 
          onClick={prevStep}
          disabled={isExiting} 
          className="btn-journey-back"
        >
          ← Back
        </button>
        <button 
          onClick={handleNext} 
          disabled={isExiting}
          className="flex-1 btn-journey-next"
        >
          Continue to Next Section →
        </button>
      </div>
    </div>
  )
}

export default BudgetSummary