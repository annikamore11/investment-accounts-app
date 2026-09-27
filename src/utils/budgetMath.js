// Shared by BudgetSummary, IncomeExpensesBar, BudgetDonutChart and the
// Income step's leftover preview so "how much is left over" is computed the
// same way everywhere — minimum debt payments count as money going out,
// same as rent or groceries, even though they're collected on their own
// step (see Debt.jsx) rather than typed into the expense breakdown.

// Whether their paycheck already has taxes taken out — drives whether
// monthlyIncome (after-tax) or netIncomeSelfEmployed (their own estimate,
// after applying the % they said they set aside) is the real take-home
// figure. Falls back to the old employment-based guess for journeys saved
// before this was its own explicit question.
// Shared with Income.jsx (converting a per-paycheck amount to a monthly
// one) and Retirement's dollar/percent inputs (the reverse, converting a
// monthly figure back to a per-paycheck one — 401(k) elections are set per
// paycheck, not monthly).
export const PAYCHECKS_PER_MONTH = {
  weekly: 4.33,
  biweekly: 2.17,
  semimonthly: 2,
  monthly: 1,
  irregular: 1,
}

export const getPaychecksPerMonth = (journeyData) =>
  PAYCHECKS_PER_MONTH[journeyData.payFrequency] || 1

export const hasTaxesWithheld = (journeyData) =>
  journeyData.taxesWithheld ?? journeyData.employment !== 'self-employed'

export const getMonthlyIncome = (journeyData) =>
  hasTaxesWithheld(journeyData)
    ? journeyData.monthlyIncome || 0
    : journeyData.netIncomeSelfEmployed || 0

export const getDebtMinPayments = (journeyData) =>
  (journeyData.debts || []).reduce((sum, d) => sum + (d.minPayment || 0), 0)

// "Expenses" as typed in on the Expenses step, plus minimum debt payments.
export const getTotalExpenses = (journeyData) =>
  (journeyData.monthlyExpenses || 0) + getDebtMinPayments(journeyData)

export const getLeftover = (journeyData) =>
  getMonthlyIncome(journeyData) - getTotalExpenses(journeyData)
