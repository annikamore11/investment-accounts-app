'use client'

import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { getDebtMinPayments, getTotalExpenses } from '@/utils/budgetMath'

const CATEGORY_LABELS = {
  rent: 'Housing',
  transportation: 'Transportation',
  food: 'Food',
  utilities: 'Utilities & Bills',
  insurance: 'Insurance',
  other: 'Other',
  debt: 'Debt Payments',
}

// Trail Waypoint data-viz set: each category gets a genuinely distinct hue
// from the same earthy family (forest, slate, amber, teal, mauve, rust)
// instead of a default rainbow of unrelated Tailwind colors.
const CATEGORY_COLORS = {
  rent: '#1F4D3A',
  transportation: '#3E6B8A',
  food: '#C96A18',
  utilities: '#2F7A6E',
  insurance: '#8C6B7A',
  other: '#97A395',
  expenses: '#2F6B4F',
  debt: '#B4432A',
}

const CustomTooltip = ({ active, payload, total }) => {
  if (!active || !payload?.length) return null
  const data = payload[0]
  const percent = ((data.value / total) * 100).toFixed(1)
  return (
    <div className="bg-primary-50 border border-primary-300 rounded-lg p-3 shadow-lg">
      <p className="font-semibold text-primary-900 mb-1">{data.name}</p>
      <p className="text-sm text-primary-700">
        <span className="font-semibold">${data.value.toLocaleString()}</span>
        <span className="text-primary-600 ml-1">({percent}%)</span>
      </p>
    </div>
  )
}

const BudgetDonutChart = ({ journeyData }) => {
  const [showTable, setShowTable] = useState(false)
  const expenses = journeyData.monthlyExpenses || 0
  const debtMinPayments = getDebtMinPayments(journeyData)
  const totalExpenses = getTotalExpenses(journeyData)
  const breakdown = Object.entries(journeyData.expenseBreakdown || {}).filter(([, amount]) => amount > 0)

  // Per-category slices if they broke expenses down, otherwise one slice —
  // either way, minimum debt payments get their own slice since they're
  // collected on a separate step, not typed into the breakdown above.
  const chartData = [
    ...(breakdown.length > 0
      ? breakdown.map(([category, amount]) => ({
          name: CATEGORY_LABELS[category] || category,
          value: amount,
          color: CATEGORY_COLORS[category] || CATEGORY_COLORS.other,
        }))
      : expenses > 0
        ? [{ name: 'Expenses', value: expenses, color: CATEGORY_COLORS.expenses }]
        : []),
    ...(debtMinPayments > 0
      ? [{ name: CATEGORY_LABELS.debt, value: debtMinPayments, color: CATEGORY_COLORS.debt }]
      : []),
  ].sort((a, b) => b.value - a.value)

  const renderCenterLabel = () => {
    return (
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
        <tspan x="50%" dy="-0.5em" className="text-sm fill-primary-600">
          Total Expenses
        </tspan>
        <tspan x="50%" dy="1.5em" className="text-2xl fill-primary-900 font-bold">
          ${(totalExpenses / 1000).toFixed(1)}k
        </tspan>
      </text>
    )
  }

  const topCategory = chartData[0]
  const topPercent = topCategory ? Math.round((topCategory.value / totalExpenses) * 100) : 0

  return (
    <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-primary-900">
          Expense Breakdown
        </h3>
        <button
          onClick={() => setShowTable(v => !v)}
          className="text-xs font-medium text-accent-green-700 hover:text-accent-green-800 underline decoration-dotted"
          aria-expanded={showTable}
        >
          {showTable ? 'View as chart' : 'View as table'}
        </button>
      </div>

      {/* The number is never locked inside the graphic alone. */}
      {totalExpenses > 0 && (
        <p className="text-xs text-primary-600 text-center mb-3">
          ${totalExpenses.toLocaleString()} total, {topPercent}% is {topCategory.name.toLowerCase()}
        </p>
      )}

      {showTable ? (
        <table className="w-full text-sm">
          <caption className="sr-only">Expense breakdown by category</caption>
          <thead>
            <tr className="text-left text-primary-600 border-b border-primary-200">
              <th scope="col" className="py-2 font-medium">Category</th>
              <th scope="col" className="py-2 font-medium text-right">Amount</th>
              <th scope="col" className="py-2 font-medium text-right">Share</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((entry) => (
              <tr key={entry.name} className="border-b border-primary-100 last:border-0">
                <td className="py-2 text-primary-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} aria-hidden="true" />
                  {entry.name}
                </td>
                <td className="py-2 text-right text-primary-900 font-medium tabular-nums">${entry.value.toLocaleString()}</td>
                <td className="py-2 text-right text-primary-600 tabular-nums">{((entry.value / totalExpenses) * 100).toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        /* flex-1 wrapper with min-h-0 for proper chart sizing */
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

          {/* Legend — includes the dollar value directly, not color alone */}
          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            {chartData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color }}
                  aria-hidden="true"
                />
                <span className="text-xs text-primary-700">
                  {entry.name} <span className="text-primary-500 tabular-nums">${entry.value.toLocaleString()}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BudgetDonutChart
