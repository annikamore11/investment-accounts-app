import React from 'react'
import { DollarSign, TrendingUp, Calendar, PiggyBank, Scale, HandCoins } from 'lucide-react'
import BudgetStackedBarChart from '@/components/charts/BudgetStackedBarChart'

const BudgetSummary = ({ journeyData, nextStep, prevStep }) => {
  const income = journeyData.monthlyIncome || 0
  const expenses = journeyData.monthlyExpenses || 0
  const taxes = journeyData.estimatedTaxDollarAmount || 0
  let netIncomeSelfEmployed = income - taxes
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

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          Your Financial Snapshot
        </h1>
        <p className="text-lg text-primary-200 max-w-4xl mx-auto">
          Here's what we learned about your finances
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column - Summary Table */}
        <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-gray-200">
          
          {/* Report Header */}
          <div className="border-b-2 border-gray-300 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Financial Summary</h2>
            <p className="text-sm text-gray-600 mt-1">Review your information</p>
          </div>

          {/* Summary Rows */}
          <div className="space-y-1 mb-8">
            
            {/* Monthly Income */}
            <div className="grid grid-cols-3 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3 col-span-2">
                <TrendingUp className="w-5 h-5 text-gray-500" />
                {journeyData.employment === 'self-employed' ? (
                  <span className="font-semibold text-gray-700">Monthly Gross Income</span>
                ) : (
                  <span className="font-semibold text-gray-700">Monthly Net Income</span>
                )}
              </div>
              <div className="text-right text-gray-900 font-bold text-lg">
                ${income.toLocaleString()}
              </div>
            </div>

            {/* Estimated Taxes - Only show for self-employed */}
            {journeyData.employment === 'self-employed' && (
              <>
                <div className="grid grid-cols-3 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3 col-span-2">
                    <Scale className="w-5 h-5 text-red-500" />
                    <span className="font-semibold text-gray-700">Est. Taxes</span>
                  </div>
                  <div className="text-right text-red-700 font-bold text-lg">
                    -${taxes?.toLocaleString() || 0}
                  </div>
                </div>

                <div className="grid grid-cols-3 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3 col-span-2">
                    <HandCoins className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold text-gray-700">Net Income</span>
                  </div>
                  <div className="text-right text-gray-900 font-bold text-lg">
                    ${netIncomeSelfEmployed?.toLocaleString() || 0}
                  </div>
                </div>
              </>
            )}

            {/* Monthly Expenses */}
            <div className="grid grid-cols-3 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3 col-span-2">
                <DollarSign className="w-5 h-5 text-red-500" />
                <span className="font-semibold text-gray-700">Monthly Expenses</span>
              </div>
              <div className="text-right text-red-700 font-bold text-lg">
                -${expenses.toLocaleString()}
              </div>
            </div>

            {/* Pay Frequency */}
            <div className="grid grid-cols-3 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3 col-span-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-gray-700">Pay Frequency</span>
              </div>
              <div className="text-right text-gray-900">
                {getFrequencyLabel(journeyData.payFrequency)}
              </div>
            </div>

            {/* Leftover */}
            <div className={`grid grid-cols-3 py-4 border-b border-gray-200 ${
              leftover >= 0 ? 'bg-green-50' : 'bg-red-50'
            } transition-colors`}>
              <div className="flex items-center space-x-3 col-span-2">
                <PiggyBank className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-gray-700">Available to Save Monthly</span>
              </div>
              <div className={`text-right font-bold text-lg ${
                leftover >= 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                {leftover >= 0 ? `$${leftover.toLocaleString()}` : `-$${Math.abs(leftover).toLocaleString()}`}
                <div className="text-sm font-normal">
                  ({savingsRate}%)
                </div>
              </div>
            </div>
          </div>

          
        </div>

        {/* Right Column - Pie Chart & Insights */}
        <div className="space-y-6">
          
          {/* Pie Chart */}
          <BudgetStackedBarChart journeyData={journeyData} />

          {/* Insights */}
          <div className={`rounded-xl p-6 border-2 ${
            leftover >= 500 ? 'bg-green-50 border-green-600' :
            leftover >= 0 ? 'bg-yellow-50 border-yellow-300' :
            'bg-red-50 border-red-300'
          }`}>
            <h3 className="font-bold text-gray-900 mb-2">Quick Insight</h3>
            {leftover >= 500 && (
              <p className="text-gray-700">
                Great! You have ${leftover.toLocaleString()} available to save and invest each month. We'll help you make the most of it.
              </p>
            )}
            {leftover > 0 && leftover < 500 && (
              <p className="text-gray-700">
                You have ${leftover.toLocaleString()} available to save. Every dollar counts - we'll help you build wealth over time!
              </p>
            )}
            {leftover <= 0 && (
              <p className="text-gray-700">
                Your expenses match or exceed your income. Focus on building an emergency fund first, even if it's just $25-50/month. Learn more in the next section.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        <button onClick={prevStep} className="btn-journey-back">
          ← Back
        </button>
        <button onClick={nextStep} className="flex-1 btn-journey-next">
          Continue to Next Section →
        </button>
      </div>
    </div>
  )
}

export default BudgetSummary