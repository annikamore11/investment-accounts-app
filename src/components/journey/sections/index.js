import { welcomeConfig } from './Welcome'
import { aboutConfig } from './About'
import { budgetConfig } from './BudgetIncome'
import { emergencyFundConfig } from './EmergencyFund'
import { retirementConfig } from './Retirement'
import { investingConfig } from './Investing'

export const SECTION_CONFIGS = [
  welcomeConfig,
  aboutConfig,
  budgetConfig,
  emergencyFundConfig,
  retirementConfig,
  investingConfig,
]

const SECTION_IDS = SECTION_CONFIGS.map(s => s.id)
const emptyPerSection = (value) => Object.fromEntries(SECTION_IDS.map(id => [id, value()]))

// Every field a step component writes via updateJourneyData. Persisted as-is
// to Convex / localStorage, so keys here are part of the saved-data contract.
export const INITIAL_JOURNEY_DATA = {
  // About You
  employment: '',
  hasEmployer401k: null,
  age: '',
  bankType: '',

  // Expenses & Income
  needsExpenseHelp: null,
  monthlyExpenses: '',
  expenseBreakdown: {},
  payFrequency: '',
  paycheckAmount: '',
  monthlyIncome: '',
  taxesWithheld: null,
  estimatedTaxPercentage: '',
  estimatedTaxDollarAmount: '',
  netIncomeSelfEmployed: '',
  // Snapshot of `employment` as of the last time the Income step was
  // completed — lets Retirement's intro step detect that employment was
  // changed since without re-deriving history. See Retirement/OpeningPage.jsx.
  incomeConfirmedEmployment: null,
  // Only asked when there's a 401(k) to ask about — whether the
  // contribution is already subtracted out of the paycheck amount above.
  // Retirement's dollar/percent conversions need this to avoid computing a
  // contribution % against a paycheck that's already net of that same
  // contribution — see getSalaryBaseForConversion in retirementMath.js.
  retirementDeductedFromPaycheck: null,
  hasDebt: null,
  debts: [], // [{ name, balance, apr, minPayment }]

  // Emergency Fund — goal and current-savings are collected once, up front,
  // for everyone (before we even know hasEmergencyFund), so both the
  // "already have one" and "building one" branches can show progress
  // against the same real goal instead of asking for an amount twice.
  hasEmergencyFund: null,
  moveToFidelity: null,
  emergencyFundGoal: '',
  emergencyFundCurrentAmount: '',
  emergencyFundAccountType: '',
  emergencyFundInstitution: '',
  existingEmergencyFundInstitution: '',
  existingEmergencyFundType: '',

  // Retirement
  companyMatch: '',
  userContribution: '',
  // Asked for everyone, 401(k) or not — the 15% savings goal is computed
  // across all retirement accounts combined, not the 401(k) alone.
  contributesToOtherRetirementAccount: null,
  otherRetirementAccountPercent: '',
  // Only meaningful when contributesToOtherRetirementAccount is true —
  // self-reported rather than computed from income, since that's more
  // reliable than approximating gross salary from take-home pay.
  willMaxRothIRA: null,
  // Only relevant while there's no current match (companyMatch === 0) —
  // see Retirement/index.jsx getSteps.
  matchAfterTenure: null,
  // Asked for everyone with a 401(k) — feeds the combined-savings
  // recommendation in retirementMath.js's getAdditionalSavingsItem.
  canContributeRothIn401k: null,
  // Only asked when the plan supports Roth AND they're already
  // contributing — canContributeRothIn401k alone only says the plan
  // *supports* Roth, not that their actual contribution is currently
  // Roth-designated. Distinguishing the two is what lets the "Set Up Roth
  // 401(k)" guide and recommendation copy skip telling someone to do
  // something they've already told us they're doing.
  contributingRothIn401k: null,
  // Asked right after the plan (see RetirementInstitutionsCheck.jsx) so we
  // know where each account actually lives — free text, matched by
  // substring like emergencyFundInstitution, not a fixed list.
  retirement401kInstitution: '',
  rothIraInstitution: '',
  // Only ever set when the Roth IRA isn't already at Fidelity but the
  // emergency fund is — offering to consolidate only when it's a real,
  // relevant option. null everywhere else, not false, so "never asked"
  // stays distinguishable from "asked and said no."
  moveRothIraToFidelity: null,

  // Non-Retirement Investing
  investingGoals: [],
  // A numeric default here would make this look "answered" before the user
  // ever touches the slider (see hasAnswers in utils/guestJourney.js); the
  // step itself still defaults the slider's position to 5.
  riskTolerance: '',
  investmentMethod: null,
  // Set only when BrokerageAccountCheck actually shows the consolidation
  // ask (i.e. the user has money at a non-Fidelity institution already) —
  // null everywhere else, not false, so "never asked" stays distinguishable
  // from "asked and said no."
  wantsFidelityConsolidation: null,

  // Progress tracking
  lastStepInSection: emptyPerSection(() => 0),
  sectionCompletion: emptyPerSection(() => false),
  completedSteps: emptyPerSection(() => []),
}

// Each section's getSteps(journeyData) returns [{ name, Component }] so the
// sidebar labels and the rendered steps always come from the same list.
export const getSectionSteps = (section, journeyData) => section.getSteps(journeyData)

// Shared by the sidebar and the overall progress tracker. Steps can
// disappear when earlier answers change (e.g. employment), so completed
// indices beyond the current step count are ignored rather than counted.
export const getSectionCompletion = (section, journeyData) => {
  const steps = getSectionSteps(section, journeyData)
  const completedSteps = (journeyData.completedSteps?.[section.id] || [])
    .filter(i => i < steps.length)
  return {
    steps,
    completedSteps,
    isFullyCompleted: steps.length > 0 && completedSteps.length === steps.length,
  }
}
