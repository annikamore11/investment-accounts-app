'use client'

import { useState } from 'react'
import { TrendingUp, Shield, CheckCircle, Edit2, DollarSign, Target, Building2 } from 'lucide-react'
import StepNavigation from '@/components/ui/StepNavigation'
import InfoBox from '@/components/ui/InfoBox'
import OptionGrid from '@/components/ui/OptionGrid'
import useStepTransition from '@/hooks/useStepTransition'
import { ACCOUNT_TYPES, EXISTING_ACCOUNT_TYPES, FIDELITY, BROKERAGES, accountTypeLabel } from './accountTypes'
import { getTotalExpenses } from '@/utils/budgetMath'

const digitsOnly = (value) => value.replace(/[^\d]/g, '')

const isFidelity = (institution) => institution.toLowerCase().includes('fidelity')
const isVanguard = (institution) => institution.toLowerCase().includes('vanguard')

// Fidelity and Vanguard both auto-sweep uninvested cash into a money market
// fund under the same login as everything else — we already know the
// account "type" without asking, and each gets its own take rather than a
// generic one: Fidelity is where the rest of this journey's steps actually
// walk someone through investing, Vanguard is just as good a place for the
// money itself but a second login later. Research turned up that this
// convenience is NOT universal across brokerages — some only offer a plain
// bank sweep (much lower yield) — so anything else still needs an actual
// answer instead of assuming "brokerage" means "money market."
const getExistingFundGuidance = (type, institution) => {
  if (!type) return null
  const label = (accountTypeLabel(type) || 'account').toLowerCase()

  if (type === 'checking' || type === 'traditional') {
    return {
      type: 'tip',
      message: `A regular ${label} usually earns close to 0% interest — that's different from "high-yield," even though the money feels just as safe either way. Consider moving it to a money market fund like Fidelity's SPAXX (~5% APY historically) so it's actually earning you something, and so it sits alongside your other accounts instead of a separate bank login.`,
    }
  }

  if (type === 'high-yield-money-market') {
    return {
      type: 'why',
      message: `A ${label} is a good place for this. Consider moving it to Fidelity when it's convenient — keeping your emergency fund, retirement, and investing on one platform makes your whole financial picture easier to see and manage, instead of spread across separate logins.`,
    }
  }

  return null
}

const EmergencyFundSummary = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()

  return (
    <div
      className={`w-full max-w-4xl mx-auto transition-all duration-500 ${
        isExiting ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="bg-white rounded-xl shadow-xl p-4 md:p-8 lg:p-12 border-2 border-primary-200">
        {journeyData.hasEmergencyFund ? (
          <ExistingFundSummary journeyData={journeyData} updateJourneyData={updateJourneyData} />
        ) : (
          <PlannedFundSummary journeyData={journeyData} updateJourneyData={updateJourneyData} />
        )}

        <StepNavigation
          onBack={prevStep}
          onNext={() => transitionTo(nextStep)}
          isExiting={isExiting}
          nextLabel="Continue to Next Section →"
          className="mt-0"
        />
      </div>
    </div>
  )
}

/* ---------- "I already have one" branch ---------- */

const ExistingFundSummary = ({ journeyData, updateJourneyData }) => {
  const [institution, setInstitution] = useState(journeyData.existingEmergencyFundInstitution || '')
  const [type, setType] = useState(journeyData.existingEmergencyFundType || '')

  // Saves as they type/select instead of behind a separate "Save Details"
  // button — these fields aren't an optional add-on (they're what the
  // Investing section's brokerage check compares against Fidelity), so
  // treating them like the rest of the journey's inline-saved fields
  // removes a step and a redundant edit/view toggle. Amount saved is NOT
  // asked here — it was already collected on the Goal step (before we even
  // knew hasEmergencyFund), so asking again would just be the same question
  // twice.
  const handleInstitutionChange = (value) => {
    setInstitution(value)
    updateJourneyData('existingEmergencyFundInstitution', value)

    if (isFidelity(value) || isVanguard(value)) {
      // We already know what this is (see the comment above
      // getExistingFundGuidance) — no need to ask.
      setType('high-yield-money-market')
      updateJourneyData('existingEmergencyFundType', 'high-yield-money-market')
    } else if (type === 'high-yield-money-market') {
      // They'd typed Fidelity/Vanguard, we auto-filled the type, and now
      // they've changed the institution to something else — that guess no
      // longer applies, so clear it and let them actually pick.
      setType('')
      updateJourneyData('existingEmergencyFundType', '')
    }
  }
  const handleTypeChange = (value) => {
    setType(value)
    updateJourneyData('existingEmergencyFundType', value)
  }

  const institutionEntered = institution.trim() !== ''
  const institutionIsFidelity = isFidelity(institution)
  const institutionIsVanguard = isVanguard(institution)
  const needsManualType = institutionEntered && !institutionIsFidelity && !institutionIsVanguard

  const guidance = needsManualType ? getExistingFundGuidance(type, institution) : null

  const goal = journeyData.emergencyFundGoal || 0
  const savedAmount = journeyData.emergencyFundCurrentAmount || 0
  const progress = goal > 0 ? Math.min((savedAmount / goal) * 100, 100) : 0

  return (
    <>
      <div className="border-b-2 border-primary-300 pb-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-primary-900 flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-accent-green-600" />
          Emergency Fund Status
        </h2>
        <p className="text-sm text-primary-600 mt-1">
          Already have one saved — that puts you ahead of most people.
        </p>
      </div>

      <div className="bg-white border-2 border-primary-300 rounded-xl p-4 md:p-6 mb-6">
        <label className="block text-sm font-semibold text-primary-700 mb-2">Where do you keep it?</label>
        <input
          type="text"
          list="existing-fund-brokerages"
          placeholder="e.g., Chase Bank, Ally, Fidelity"
          value={institution}
          onChange={(e) => handleInstitutionChange(e.target.value)}
          className="w-full p-2 border-2 border-primary-300 rounded-lg focus:border-accent-green-500 focus:outline-none"
        />
        {/* A datalist, not a closed dropdown: brokerages are a known,
            short list worth suggesting, but banks/credit unions aren't (no
            database backs this yet — see project discussion), so free text
            still has to work for those. */}
        <datalist id="existing-fund-brokerages">
          {BROKERAGES.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </div>

      {/* Fidelity and Vanguard each get their own take instead of a generic
          "account type" question — everyone else still needs to actually
          tell us, since not every brokerage auto-sweeps into money market
          the way these two do. */}
      {institutionIsFidelity && (
        <InfoBox
          type="why"
          message="This is the best setup for your journey — later steps walk you through everything using Fidelity, so your emergency fund is already exactly where it needs to be."
        />
      )}

      {institutionIsVanguard && (
        <InfoBox
          type="why"
          message="Great choice — your money is earning a real rate and sits automatically in a money market fund, no extra setup needed. It may be slightly less convenient later on since we walk through investing specifically with Fidelity, but if you've already got this set up, your plan works just as well here — no need to switch."
        />
      )}

      {needsManualType && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-primary-700 mb-3">What kind of account is it?</label>
          <OptionGrid
            options={EXISTING_ACCOUNT_TYPES}
            selectedValue={type}
            onChange={handleTypeChange}
            columns={2}
            className="mb-0"
          />
          {guidance && <InfoBox type={guidance.type} message={guidance.message} className="mt-4" />}
        </div>
      )}

      {!institutionEntered && (
        <p className="text-sm text-primary-500 mb-6">
          Tell us where it's held above to get guidance specific to your setup.
        </p>
      )}

      {goal > 0 && (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-primary-700">Progress to Goal</span>
            <span className="text-sm font-bold text-accent-green-700">{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-primary-300 rounded-full h-3 overflow-hidden mb-2">
            <div
              className="bg-accent-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-primary-700">
            <span>${savedAmount.toLocaleString()} saved</span>
            <span>${goal.toLocaleString()} goal</span>
          </div>
          {savedAmount < goal ? (
            <p className="text-xs text-primary-600 mt-2 text-center">
              ${(goal - savedAmount).toLocaleString()} left to reach your goal
            </p>
          ) : (
            <p className="text-sm text-accent-green-700 font-semibold mt-2 text-center">
              🎉 You've reached your goal!
            </p>
          )}
        </div>
      )}
    </>
  )
}

/* ---------- "Help me set one up" branch ---------- */

const SummaryRow = ({ icon: Icon, label, children }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 py-4 border-b border-primary-200 hover:bg-primary-50 transition-colors">
    <div className="flex items-center space-x-3 md:col-span-1 mb-2 md:mb-0">
      <Icon className="w-5 h-5 text-primary-500" />
      <span className="font-semibold text-primary-700">{label}</span>
    </div>
    <div className="md:col-span-2">{children}</div>
  </div>
)

const EditButton = ({ onClick, title }) => (
  <button
    onClick={onClick}
    aria-label={title}
    title={title}
    className="min-h-11 min-w-11 flex items-center justify-center hover:bg-primary-200 rounded-md transition-colors"
  >
    <Edit2 className="w-4 h-4 text-primary-500" />
  </button>
)

const SaveCancel = ({ onSave, onCancel }) => (
  <div className="flex gap-2">
    <button onClick={onSave} className="px-3 py-1 bg-accent-green-600 text-white text-sm rounded hover:bg-accent-green-700">
      Save
    </button>
    <button onClick={onCancel} className="px-3 py-1 bg-primary-300 text-primary-700 text-sm rounded hover:bg-primary-400">
      Cancel
    </button>
  </div>
)

const PlannedFundSummary = ({ journeyData, updateJourneyData }) => {
  const goal = journeyData.emergencyFundGoal || 0
  const current = journeyData.emergencyFundCurrentAmount || 0
  const accountType = journeyData.emergencyFundAccountType || 'money-market'
  const institution = journeyData.emergencyFundInstitution || FIDELITY
  const progress = goal > 0 ? Math.min((current / goal) * 100, 100) : 0

  const [editing, setEditing] = useState(null) // 'institution' | 'accountType' | 'amount' | null
  const [institutionDraft, setInstitutionDraft] = useState(institution)
  const [amountDraft, setAmountDraft] = useState(String(current))

  const saveInstitution = () => {
    updateJourneyData('emergencyFundInstitution', institutionDraft)
    setEditing(null)
  }
  const saveAmount = () => {
    updateJourneyData('emergencyFundCurrentAmount', parseFloat(amountDraft) || 0)
    setEditing(null)
  }
  const chooseAccountType = (value) => {
    updateJourneyData('emergencyFundAccountType', value)
    setEditing(null)
  }

  return (
    <>
      <div className="border-b-2 border-primary-300 pb-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-primary-900">Emergency Fund Summary</h2>
        <p className="text-sm text-primary-600 mt-1">Review your emergency fund plan below</p>
      </div>

      <div className="space-y-1 mb-8">
        <SummaryRow icon={Building2} label="Financial Institution">
          {editing === 'institution' ? (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter institution name"
                value={institutionDraft}
                onChange={(e) => setInstitutionDraft(e.target.value)}
                className="w-full p-2 border-2 border-amber-300 rounded-lg focus:border-amber-600 focus:outline-none"
              />
              <SaveCancel onSave={saveInstitution} onCancel={() => { setInstitutionDraft(institution); setEditing(null) }} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-primary-900 text-base md:text-lg font-semibold">{institution}</span>
              <EditButton onClick={() => setEditing('institution')} title="Change institution" />
            </div>
          )}
        </SummaryRow>

        <SummaryRow icon={Shield} label="Account Type">
          {editing === 'accountType' ? (
            <div className="space-y-2">
              {ACCOUNT_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => chooseAccountType(t.value)}
                  className={`block w-full text-left px-3 py-2 rounded border-2 font-semibold text-primary-900 ${
                    t.value === accountType
                      ? 'border-accent-green-600 bg-accent-green-50 hover:bg-accent-green-100'
                      : 'border-primary-300 hover:border-primary-400 hover:bg-primary-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
              <button onClick={() => setEditing(null)} className="text-sm text-primary-600 hover:text-primary-800">
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-primary-900 text-base md:text-lg font-semibold">{accountTypeLabel(accountType)}</span>
              <EditButton onClick={() => setEditing('accountType')} title="Change account type" />
            </div>
          )}
        </SummaryRow>

        <SummaryRow icon={Target} label="Goal Amount">
          <div className="text-primary-900 text-base md:text-lg font-semibold">${goal.toLocaleString()}</div>
          <div className="text-sm text-primary-600 mt-1">
            {(goal / (getTotalExpenses(journeyData) || 1)).toFixed(1)} months of expenses
          </div>
        </SummaryRow>

        <SummaryRow icon={DollarSign} label="Starting Amount">
          {editing === 'amount' ? (
            <div className="flex items-center gap-2">
              <span className="text-base md:text-lg font-bold">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={amountDraft}
                onChange={(e) => setAmountDraft(digitsOnly(e.target.value))}
                className="w-32 text-base md:text-lg font-semibold p-1 border-2 border-amber-300 rounded focus:border-amber-600 focus:outline-none"
              />
              <SaveCancel onSave={saveAmount} onCancel={() => { setAmountDraft(String(current)); setEditing(null) }} />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="text-primary-900 text-base md:text-lg font-semibold">${current.toLocaleString()}</span>
                <EditButton onClick={() => setEditing('amount')} title="Edit amount" />
              </div>
              {current === 0 && (
                <div className="text-sm text-primary-600 mt-1 italic">Starting from scratch - that&apos;s okay!</div>
              )}
            </>
          )}
        </SummaryRow>

        <SummaryRow icon={TrendingUp} label="Progress">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-primary-600">To Goal</span>
            <span className="text-sm font-bold text-accent-green-700">{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-primary-300 rounded-full h-3 overflow-hidden mb-2">
            <div className="bg-accent-green-600 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          {current < goal ? (
            <div className="text-sm text-primary-600">${(goal - current).toLocaleString()} remaining</div>
          ) : (
            <div className="text-sm text-accent-green-700 font-semibold">Goal reached!</div>
          )}
        </SummaryRow>
      </div>
    </>
  )
}

export default EmergencyFundSummary
