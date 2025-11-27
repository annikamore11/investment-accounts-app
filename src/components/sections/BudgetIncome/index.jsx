// sections/Budget/index.jsx

import MonthlyExpensesEstimate from './MonthlyExpensesEstimate'
import Income from './Income'
import BudgetSummary from './BudgetSummary'

export const budgetConfig = {
  id: 'budget',
  title: 'Expenses & Income',
  multipleSteps: true,
  stepLabels: ['Expenses', 'Income', 'Summary'], // Static labels
  
  getSteps: (journeyData) => {
    const steps = [MonthlyExpensesEstimate]
    
    
    steps.push(Income)
    steps.push(BudgetSummary)
    
    return steps
  },
  
  canComplete: (journeyData) => {
    return journeyData.monthlyExpenses && 
           journeyData.monthlyIncome 
  },
  
  onComplete: null
}

export const budgetSteps = [
  MonthlyExpensesEstimate,
  Income,
  BudgetSummary
]