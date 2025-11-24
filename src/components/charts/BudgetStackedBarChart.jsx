import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

const BudgetStackedBarChart = ({ journeyData }) => {
  const income = journeyData.monthlyIncome || 0
  const expenses = journeyData.monthlyExpenses || 0
  const taxes = journeyData.estimatedTaxDollarAmount || 0
  const isSelfEmployed = journeyData.employment === 'self-employed'
  
  const leftover = isSelfEmployed 
    ? income - taxes - expenses 
    : income - expenses

  // Check if expense breakdown exists
  const hasBreakdown = journeyData.expenseBreakdown && Object.keys(journeyData.expenseBreakdown).length > 0

  // Detect mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768


  const formatCategoryName = (category) => {
    const names = {
      rent: 'Housing',
      carPayment: 'Car Payment',
      food: 'Food',
      utilities: 'Utilities, Loans, Bills',
      insurance: 'Insurance',
      other: 'Other'
    }
    return names[category] || category
  }

  const getCategoryColor = (category) => {
    const colors = {
      rent: '#8b5cf6',
      carPayment: '#ec4899',
      food: '#f59e0b',
      utilities: '#3b82f6',
      insurance: '#06b6d4',
      other: '#6b7280',
      taxes: '#dc2626'
    }
    return colors[category] || '#9ca3af'
  }

  // Generate chart data for stacked bar
  const generateChartData = () => {
    const data = {
      name: 'Monthly Income',
    }

    // Add taxes for self-employed
    if (isSelfEmployed && taxes > 0) {
      data['Taxes'] = taxes
    }

    // Add expense breakdown or total
    if (hasBreakdown) {
      Object.entries(journeyData.expenseBreakdown).forEach(([category, amount]) => {
        if (amount > 0) {
          data[formatCategoryName(category)] = amount
        }
      })
    } else if (expenses > 0) {
      data['Expenses'] = expenses
    }

    // Add savings
    if (leftover > 0) {
      data['Available to Save'] = leftover
    } else if (leftover < 0) {
      data['Deficit'] = Math.abs(leftover)
    }

    return [data]
  }

  const chartData = generateChartData()
  const dataKeys = Object.keys(chartData[0]).filter(key => key !== 'name')

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">Breakdown:</p>
          {payload.reverse().map((entry, index) => {
            const percent = ((entry.value / income) * 100).toFixed(1)
            return (
              <div key={index} className="flex items-center justify-between gap-4 mb-1">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-gray-700">{entry.name}:</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    ${entry.value.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-600 ml-1">({percent}%)</span>
                </div>
              </div>
            )
          })}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
      <h3 className="font-semibold text-gray-900 mb-4 text-center">
        {isSelfEmployed ? 'Gross Income Breakdown' : 'Income Breakdown'}
      </h3>
      
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }} 
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            type="number" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <YAxis 
            type="category" 
            dataKey="name"
            stroke="#6b7280"
            hide={true}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
          
          {/* Stacked bars */}
          {isSelfEmployed && taxes > 0 && (
            <Bar dataKey="Taxes" stackId="a" fill="#dc2626" />
          )}
          
          {hasBreakdown ? (
            // Individual expense categories
            Object.keys(journeyData.expenseBreakdown || {}).map((category) => {
              if (journeyData.expenseBreakdown[category] > 0) {
                return (
                  <Bar 
                    key={category}
                    dataKey={formatCategoryName(category)} 
                    stackId="a" 
                    fill={getCategoryColor(category)} 
                  />
                )
              }
              return null
            })
          ) : (
            // Just total expenses
            expenses > 0 && <Bar dataKey="Expenses" stackId="a" fill="#f59e0b" />
          )}
          
          {leftover > 0 ? (
            <Bar dataKey="Available to Save" stackId="a" fill="#16a34a" />
          ) : leftover < 0 ? (
            <Bar dataKey="Deficit" stackId="a" fill="#dc2626" />
          ) : null}
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="px-6 mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
        {dataKeys.map((key) => {
          let color = '#9ca3af'
          
          if (key === 'Taxes') color = '#dc2626'
          else if (key === 'Available to Save') color = '#16a34a'
          else if (key === 'Deficit') color = '#dc2626'
          else if (key === 'Expenses') color = '#f59e0b'
          else {
            // Find the raw category key that matches this formatted name
            const rawKey = Object.keys(journeyData.expenseBreakdown || {}).find(
              cat => formatCategoryName(cat) === key
            )
            color = rawKey ? getCategoryColor(rawKey) : '#9ca3af'
          }

          return (
            <div key={key} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded flex-shrink-0" 
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-700 truncate">
                {key}
              </span>
            </div>
          )
        })}
      </div>
      <div className="mt-6 text-center pt-4 border-t border-gray-300">
        <p className="text-sm text-gray-700">
          Total {isSelfEmployed ? 'Gross Income' : 'Income'}: <strong>${income.toLocaleString()}</strong>
        </p>
      </div>
    </div>
  )
}

export default BudgetStackedBarChart