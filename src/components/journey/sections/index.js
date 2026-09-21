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
  bankInstitution: null,
  bankInstitutionName: '',
  bankVerificationMethod: '',

  // Expenses & Income
  needsExpenseHelp: null,
  monthlyExpenses: '',
  expenseBreakdown: {},
  payFrequency: '',
  paycheckAmount: '',
  monthlyIncome: '',
  estimatedTaxPercentage: '',
  estimatedTaxDollarAmount: '',
  netIncomeSelfEmployed: '',

  // Emergency Fund
  hasEmergencyFund: null,
  emergencyFundGoal: '',
  emergencyFundCurrentAmount: '',
  emergencyFundAccountType: '',
  emergencyFundInstitution: '',
  existingEmergencyFundInstitution: '',
  existingEmergencyFundType: '',
  existingEmergencyFundAmount: '',

  // Retirement
  hasEmployerMatch: null,
  companyMatch: '',
  userContribution: '',
  wantsToIncreaseContribution: null,
  openIRA: null,
  wantstoopenIRA: null,

  // Non-Retirement Investing
  investingGoals: [],
  // A numeric default here would make this look "answered" before the user
  // ever touches the slider (see hasAnswers in utils/guestJourney.js); the
  // step itself still defaults the slider's position to 5.
  riskTolerance: '',
  investmentMethod: null,

  // Progress tracking
  lastStepInSection: emptyPerSection(() => 0),
  sectionCompletion: emptyPerSection(() => false),
  completedSteps: emptyPerSection(() => []),
}

// Each section's getSteps(journeyData) returns [{ name, Component }] so the
// sidebar labels and the rendered steps always come from the same list.
export const getSectionSteps = (section, journeyData) => section.getSteps(journeyData)
