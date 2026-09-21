'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const CATEGORY_LABELS = {
  rent: 'Housing',
  carPayment: 'Car Payment',
  food: 'Food',
  utilities: 'Utilities, Loans, Bills',
  insurance: 'Insurance',
  other: 'Other',
}

const CATEGORY_COLORS = {
  rent: '#8b5cf6',
  carPayment: '#ec4899',
  food: '#f59e0b',
  utilities: '#3b82f6',
  insurance: '#06b6d4',
  other: '#6b7280',
  expenses: '#f59e0b',
}

const CustomTooltip = ({ active, payload, total }) => {
  if (!active || !payload?.length) return null
  const data = payload[0]
  const percent = ((data.value / total) * 100).toFixed(1)
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-lg">
      <p className="font-semibold text-gray-900 mb-1">{data.name}</p>
      <p className="text-sm text-gray-700">
        <span className="font-semibold">${data.value.toLocaleString()}</span>
        <span className="text-gray-600 ml-1">({percent}%)</span>
      </p>
    </div>
  )
}

const BudgetDonutChart = ({ journeyData }) => {
  const totalExpenses = journeyData.monthlyExpenses || 0
  const breakdown = Object.entries(journeyData.expenseBreakdown || {}).filter(([, amount]) => amount > 0)

  // Per-category slices if they broke expenses down, otherwise one slice
  const chartData = (breakdown.length > 0
    ? breakdown.map(([category, amount]) => ({
        name: CATEGORY_LABELS[category] || category,
        value: amount,
        color: CATEGORY_COLORS[category] || '#9ca3af',
      }))
    : totalExpenses > 0
      ? [{ name: 'Expenses', value: totalExpenses, color: CATEGORY_COLORS.expenses }]
      : []
  ).sort((a, b) => b.value - a.value)

  const renderCenterLabel = () => {
    return (
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
        <tspan x="50%" dy="-0.5em" className="text-sm fill-gray-600">
          Total Expenses
        </tspan>
        <tspan x="50%" dy="1.5em" className="text-2xl fill-gray-900 font-bold">
          ${(totalExpenses / 1000).toFixed(1)}k
        </tspan>
      </text>
    )
  }

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 h-full flex flex-col">
      <h3 className="font-semibold text-gray-900 mb-4 text-center">
        Expense Breakdown
      </h3>
      
      {/* flex-1 wrapper with min-h-0 for proper chart sizing */}
      <div className="flex-1 flex flex-col justify-between min-h-0">
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height={300} className="lg:h-full">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={2}
                dataKey="value"
                label={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip total={totalExpenses} />} />
              {renderCenterLabel()}
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
          {chartData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-gray-700">
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BudgetDonutChart