// Where a user keeps (or plans to keep) their emergency fund. Values are
// persisted in journeyData, so don't rename them without a migration.
export const FIDELITY = 'Fidelity Investments'

export const ACCOUNT_TYPES = [
  { value: 'money-market', label: 'Money Market Fund (SPAXX)' },
  { value: 'money-market-other', label: 'Money Market Fund (Other)' },
  { value: 'high-yield-savings', label: 'High-Yield Savings Account' },
  { value: 'bank', label: 'Traditional Bank Account' },
  { value: 'other', label: 'Other' },
]

// Options offered when someone tells us about a fund they already have
export const EXISTING_ACCOUNT_TYPES = [
  { value: 'money-market', label: 'Money Market Fund' },
  { value: 'high-yield', label: 'High-Yield Savings' },
  { value: 'traditional', label: 'Traditional Savings' },
  { value: 'checking', label: 'Checking Account' },
  { value: 'other', label: 'Other' },
]

export const accountTypeLabel = (value) =>
  [...ACCOUNT_TYPES, ...EXISTING_ACCOUNT_TYPES].find(t => t.value === value)?.label || value
