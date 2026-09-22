'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { getMonthlyIncome, getTotalExpenses, getLeftover } from '@/utils/budgetMath'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const data = payload[0]
  return (
    <div className="bg-primary-50 border border-primary-300 rounded-lg p-3 shadow-lg">
      <p className="font-semibold text-primary-900">{data.name}</p>
      <p className="text-sm text-primary-700 mt-1">
        Value: <span className="font-semibold tabular-nums">${data.value.toLocaleString()}</span>
      </p>
    </div>
  )
}

const IncomeExpensesBar = ({ journeyData }) => {
  const netIncomeSelfEmployed = journeyData.netIncomeSelfEmployed || 0
  const isSelfEmployed = journeyData.employment === 'self-employed'

  const income = getMonthlyIncome(journeyData)
  // Includes minimum debt payments, collected on their own step — see budgetMath.js
  const totalExpenses = getTotalExpenses(journeyData)
  const leftover = getLeftover(journeyData)
  const hasDeficit = leftover < 0

  const chartData = [
    {
      name: 'Income',
      value: income,
      fill: '#2F6B4F', // forest-500
    },
    {
      name: 'Expenses',
      value: totalExpenses,
      fill: hasDeficit ? '#B4432A' : '#CE9012', // rust-500 over budget, amber-600 otherwise
    }
  ]

  return (
    <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 h-full flex flex-col">
      <h3 className="font-semibold text-primary-900 mb-1 text-center">
        Income vs Expenses
      </h3>
      <p className="text-xs text-primary-600 text-center mb-3">
        {hasDeficit
          ? `Spending $${Math.abs(leftover).toLocaleString()} more than you bring in each month`
          : `$${leftover.toLocaleString()} left over each month after expenses`}
      </p>

      {/* flex-1 wrapper makes content fill available space */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Status Badge — state is named in text, never color alone */}
        <div className="mb-4 flex justify-center">
          {hasDeficit ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rust-50 border-2 border-rust-500 rounded-lg">
              <AlertCircle className="w-5 h-5 text-rust-600" aria-hidden="true" />
              <div className="text-left">
                <p className="text-sm font-semibold text-rust-900">Budget Deficit</p>
                <p className="text-xs text-rust-700 tabular-nums">
                  ${Math.abs(leftover).toLocaleString()}/month over budget
                </p>
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-green-50 border-2 border-accent-green-600 rounded-lg">
              <CheckCircle className="w-5 h-5 text-accent-green-600" aria-hidden="true" />
              <div className="text-left">
                <p className="text-sm font-semibold text-accent-green-900">Available to Save</p>
                <p className="text-xs text-accent-green-700 tabular-nums">
                  ${leftover.toLocaleString()}/month
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height={250} className="lg:h-full">
            <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8E0" />
              <XAxis
                dataKey="name"
                stroke="#4A574B"
                style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'ClashGrotesk, sans-serif' }}
              />
              <YAxis
                stroke="#4A574B"
                style={{ fontSize: '12px', fontFamily: 'ClashGrotesk, sans-serif' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                width={50}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(20, 25, 21, 0.05)' }}
                contentStyle={{ display: 'none' }} // This hides the default tooltip
                wrapperStyle={{}} // Ensures custom tooltip shows
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-center pt-4 border-t border-primary-200">
          <div>
            {isSelfEmployed ? (
              <div>
                <p className="text-xs text-primary-600 mb-1">Monthly Est. Net Income</p>
                <p className="text-base font-bold text-accent-green-700 tabular-nums">${netIncomeSelfEmployed.toLocaleString()}</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-primary-600 mb-1">Monthly Net Income</p>
                <p className="text-base font-bold text-accent-green-700 tabular-nums">${income.toLocaleString()}</p>
              </div>
            )}
          </div>
          <div>
            <p className="text-xs text-primary-600 mb-1">Total Expenses</p>
            <p className={`text-base font-bold tabular-nums ${hasDeficit ? 'text-rust-700' : 'text-primary-900'}`}>
              ${totalExpenses.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IncomeExpensesBar
