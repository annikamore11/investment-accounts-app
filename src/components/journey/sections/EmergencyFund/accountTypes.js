// Where a user keeps (or plans to keep) their emergency fund. Values are
// persisted in journeyData, so don't rename them without a migration.
export const FIDELITY = 'Fidelity Investments'

// Well-known retail brokerages, hardcoded rather than pulled from a bank/
// credit-union database (FDIC/NCUA don't cover broker-dealers, and FINRA's
// BrokerCheck registry is compliance-oriented, not a clean consumer name
// list — see project discussion). Suggested via a <datalist> on the
// "where do you keep it?" input in EmergencyFundSummary.jsx, which also
// special-cases Fidelity and Vanguard specifically (not this whole list):
// research turned up that those two auto-sweep cash into a money market
// fund under one login, but that convenience isn't universal — some
// brokerages only offer a plain bank sweep at a much lower yield — so
// everything else still has to ask what kind of account it actually is.
export const BROKERAGES = [
  FIDELITY,
  'Vanguard',
  'Charles Schwab',
  'Robinhood',
  'E*TRADE',
  'Merrill Edge',
  'SoFi Invest',
  'Ally Invest',
  'Interactive Brokers',
  'Webull',
  'M1 Finance',
  'Public.com',
  'Betterment',
  'Wealthfront',
  'TD Ameritrade',
  "J.P. Morgan Self-Directed Investing",
  'Acorns',
  'Stash',
]

export const ACCOUNT_TYPES = [
  { value: 'money-market', label: 'Money Market Fund (SPAXX)' },
  { value: 'money-market-other', label: 'Money Market Fund (Other)' },
  { value: 'high-yield-savings', label: 'High-Yield Savings Account' },
  { value: 'bank', label: 'Traditional Bank Account' },
  { value: 'other', label: 'Other' },
]

// Options offered when someone tells us about a fund they already have.
// Money market and high-yield savings are collapsed into one option here
// (unlike ACCOUNT_TYPES below, which distinguishes them for someone setting
// up a NEW account) — for someone reporting what they already have, the
// distinction isn't worth an extra decision; both earn a real rate and get
// the same guidance either way.
export const EXISTING_ACCOUNT_TYPES = [
  { value: 'high-yield-money-market', label: 'High Yield / Money Market' },
  { value: 'traditional', label: 'Traditional Savings' },
  { value: 'checking', label: 'Checking Account' },
  { value: 'other', label: 'Other' },
]

export const accountTypeLabel = (value) =>
  [...ACCOUNT_TYPES, ...EXISTING_ACCOUNT_TYPES].find(t => t.value === value)?.label || value
