import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Generate data for compound interest comparison
const generateChartData = (principal, rate, years) => {
  const data = []
  
  for (let year = 0; year <= years; year++) {
    data.push({
      year: `Year ${year}`,
      'Traditional Bank': principal,
      'Money Market Fund': Math.round(principal * Math.pow(1 + rate, year))
    })
  }
  return data
}

// Custom tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-primary-50 border border-gray-400 rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-gray-900 mb-1">{payload[0].payload.year}</p>
        <p className="text-sm text-gray-700">
          Traditional Bank: <strong>${payload[0].value.toLocaleString()}</strong>
        </p>
        <p className="text-sm text-green-700">
          Money Market Fund: <strong>${payload[1].value.toLocaleString()}</strong>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Difference: ${(payload[1].value - payload[0].value).toLocaleString()}
        </p>
      </div>
    )
  }
  return null
}

const CompoundInterestChart = ({ principal = 10000, rate = 0.05, years = 5 }) => {
  const chartData = generateChartData(principal, rate, years)
  const finalBank = principal
  const finalMoneyMarket = Math.round(principal * Math.pow(1 + rate, years))
  const difference = finalMoneyMarket - finalBank

  return (
    <div className="bg-primary-50 border border-gray-400 rounded-lg p-6">
      <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-3 mb-4">
        <p className="text-xs text-yellow-900">
          <strong>Hypothetical Example:</strong> This assumes a constant {(rate * 100).toFixed(1)}% annual interest rate. 
          Actual rates vary and are not guaranteed.
        </p>
      </div>
      
      <p className="font-semibold text-gray-900 mb-4">
        Example Comparison Over {years} Years (at {(rate * 100).toFixed(1)}% annual rate):
      </p>
      
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="year" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
            iconType="line"
          />
          <Line 
            type="monotone" 
            dataKey="Traditional Bank" 
            stroke="#9ca3af" 
            strokeWidth={2}
            dot={{ fill: '#9ca3af', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="Money Market Fund" 
            stroke="#16a34a" 
            strokeWidth={2}
            dot={{ fill: '#16a34a', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-700">
          Starting amount: <strong>${principal.toLocaleString()}</strong>
        </p>
        <p className="text-lg font-bold text-green-700 mt-1">
          That's a potential growth of ${difference.toLocaleString()} in free money!
        </p>
       
      </div>
    </div>
  )
}

export default CompoundInterestChart