// sections/Budget/index.jsx

import MonthlyExpensesEstimate from './MonthlyExpensesEstimate'
import ExpenseBreakdown from './ExpenseBreakdown'
import Income from './Income'
import PayFrequency from './PayFrequency'
import BudgetSummary from './BudgetSummary'

export const budgetConfig = {
  id: 'budget',
  title: 'Expenses & Income',
  multipleSteps: true,
  
  getSteps: (journeyData) => {
    const steps = [MonthlyExpensesEstimate]
    
    // Only show breakdown if they want help estimating
    if (journeyData.needsExpenseHelp === true) {
      steps.push(ExpenseBreakdown)
    }
    
    steps.push(Income)
    steps.push(PayFrequency)
    steps.push(BudgetSummary)
    
    return steps
  },
  
  canComplete: (journeyData) => {
    return journeyData.monthlyExpenses && 
           journeyData.monthlyIncome && 
           journeyData.payFrequency
  },
  
  onComplete: null
}

export const budgetSteps = [
  MonthlyExpensesEstimate,
  ExpenseBreakdown,
  Income,
  PayFrequency,
  BudgetSummary
]