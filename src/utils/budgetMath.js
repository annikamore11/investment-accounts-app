// Shared by BudgetSummary, IncomeExpensesBar, BudgetDonutChart and the
// Income step's leftover preview so "how much is left over" is computed the
// same way everywhere — minimum debt payments count as money going out,
// same as rent or groceries, even though they're collected on their own
// step (see Debt.jsx) rather than typed into the expense breakdown.

export const getMonthlyIncome = (journeyData) =>
  journeyData.employment === 'self-employed'
    ? journeyData.netIncomeSelfEmployed || 0
    : journeyData.monthlyIncome || 0

export const getDebtMinPayments = (journeyData) =>
  (journeyData.debts || []).reduce((sum, d) => sum + (d.minPayment || 0), 0)

// "Expenses" as typed in on the Expenses step, plus minimum debt payments.
export const getTotalExpenses = (journeyData) =>
  (journeyData.monthlyExpenses || 0) + getDebtMinPayments(journeyData)

export const getLeftover = (journeyData) =>
  getMonthlyIncome(journeyData) - getTotalExpenses(journeyData)
