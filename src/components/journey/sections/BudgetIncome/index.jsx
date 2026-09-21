import MonthlyExpensesEstimate from './MonthlyExpensesEstimate'
import Income from './Income'
import BudgetSummary from './BudgetSummary'

export const budgetConfig = {
  id: 'budget',
  title: 'Expenses & Income',
  multipleSteps: true,

  getSteps: () => [
    { name: 'Expenses', Component: MonthlyExpensesEstimate },
    { name: 'Income', Component: Income },
    { name: 'Summary', Component: BudgetSummary },
  ],
}
