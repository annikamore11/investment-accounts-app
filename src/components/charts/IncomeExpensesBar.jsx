// src/components/charts/IncomeExpensesBar.jsx
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { AlertCircle, CheckCircle } from 'lucide-react'

const IncomeExpensesBar = ({ journeyData }) => {
  const income = journeyData.monthlyIncome || 0
  const netIncomeSelfEmployed = journeyData.netIncomeSelfEmployed || 0
  const expenses = journeyData.monthlyExpenses || 0
  const isSelfEmployed = journeyData.employment === 'self-employed'
  
  const totalExpenses = expenses
  const leftover = isSelfEmployed ? netIncomeSelfEmployed - expenses : income - totalExpenses
  const hasDeficit = leftover < 0

  const chartData = [
    {
      name: 'Income',
      value: income,
      fill: '#16a34a'
    },
    {
      name: 'Expenses',
      value: totalExpenses,
      fill: hasDeficit ? '#dc2626' : '#f59e0b'
    }
  ]

  const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-gray-900">{data.name}</p>
        <p className="text-sm text-gray-700 mt-1">
          Value: <span className="font-semibold">${data.value.toLocaleString()}</span>
        </p>
      </div>
    )
  }
  return null
}

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 h-full flex flex-col">
      <h3 className="font-semibold text-gray-900 mb-4 text-center">
        Income vs Expenses
      </h3>

      {/* flex-1 wrapper makes content fill available space */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Status Badge */}
        <div className="mb-4 flex justify-center">
          {hasDeficit ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border-2 border-red-600 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div className="text-left">
                <p className="text-sm font-semibold text-red-900">Budget Deficit</p>
                <p className="text-xs text-red-700">
                  ${Math.abs(leftover).toLocaleString()}/month over budget
                </p>
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border-2 border-green-600 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <p className="text-sm font-semibold text-green-900">Available to Save</p>
                <p className="text-xs text-green-700">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                style={{ fontSize: '14px', fontWeight: '600' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                width={50}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
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
        <div className="mt-4 grid grid-cols-2 gap-4 text-center pt-4 border-t border-gray-300">
          <div>
            {isSelfEmployed ? (
              <div>
                <p className="text-xs text-gray-600 mb-1">Monthly Est. Net Income</p>
                <p className="text-base font-bold text-green-700">${netIncomeSelfEmployed.toLocaleString()}</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-600 mb-1">Monthly Net Income</p>
                <p className="text-base font-bold text-green-700">${income.toLocaleString()}</p>
              </div>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Total Expenses</p>
            <p className={`text-base font-bold ${hasDeficit ? 'text-red-700' : 'text-gray-900'}`}>
              ${totalExpenses.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IncomeExpensesBar