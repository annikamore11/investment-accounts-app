'use client'

import { useState } from 'react'
import { TrendingUp, Shield, CheckCircle, Edit2, DollarSign, Target, Building2 } from 'lucide-react'
import StepNavigation from '@/components/ui/StepNavigation'
import InfoBox from '@/components/ui/InfoBox'
import useStepTransition from '@/hooks/useStepTransition'
import { ACCOUNT_TYPES, EXISTING_ACCOUNT_TYPES, FIDELITY, accountTypeLabel } from './accountTypes'

const digitsOnly = (value) => value.replace(/[^\d]/g, '')

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
  const [isEditing, setIsEditing] = useState(false)
  const [institution, setInstitution] = useState(journeyData.existingEmergencyFundInstitution || '')
  const [type, setType] = useState(journeyData.existingEmergencyFundType || '')
  const [amount, setAmount] = useState(journeyData.existingEmergencyFundAmount || '')

  const save = () => {
    updateJourneyData('existingEmergencyFundInstitution', institution)
    updateJourneyData('existingEmergencyFundType', type)
    updateJourneyData('existingEmergencyFundAmount', parseFloat(amount) || 0)
    setIsEditing(false)
  }

  return (
    <>
      <div className="border-b-2 border-primary-300 pb-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-primary-900">Emergency Fund Status</h2>
        <p className="text-sm text-primary-600 mt-1">You&apos;re already prepared!</p>
      </div>

      <div className="bg-accent-green-50 border-2 border-accent-green-600 rounded-xl p-4 md:p-6 mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-accent-green-600" />
          <h3 className="text-lg md:text-xl font-bold text-accent-green-900">Excellent Work!</h3>
        </div>
        <p className="text-sm md:text-base text-accent-green-800">
          You already have an emergency fund set up. That&apos;s a huge accomplishment and puts you ahead of most people.
        </p>
      </div>

      <InfoBox
        type="tip"
        message="Make sure your emergency fund is earning interest! If it's sitting in a regular checking/savings account earning 0%, consider moving it to a money market fund like SPAXX to earn ~5% annually."
      />

      <InfoBox type="info">
        <p className="text-sm mb-3">
          <strong>Optional:</strong> Save your emergency fund details for organization and to keep all your
          financial info in one place on your dashboard.
        </p>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm font-semibold text-accent-green-700 hover:text-accent-green-900 underline"
          >
            {journeyData.existingEmergencyFundInstitution ? 'Edit Details' : '+ Add Your Emergency Fund Details'}
          </button>
        ) : (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-semibold text-primary-700 mb-2">Where do you keep it?</label>
              <input
                type="text"
                placeholder="e.g., Chase Bank, Ally, Fidelity"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full p-2 border-2 border-primary-300 rounded-lg focus:border-accent-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary-700 mb-2">Account Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 border-2 border-primary-300 rounded-lg focus:border-accent-green-500 focus:outline-none"
              >
                <option value="">Select account type</option>
                {EXISTING_ACCOUNT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary-700 mb-2">Amount Saved</label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="10000"
                  value={amount}
                  onChange={(e) => setAmount(digitsOnly(e.target.value))}
                  className="flex-1 p-2 border-2 border-primary-300 rounded-lg focus:border-accent-green-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={save} className="px-4 py-2 bg-accent-green-600 text-white rounded-lg hover:bg-accent-green-700">
                Save Details
              </button>
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-primary-300 text-primary-700 rounded-lg hover:bg-primary-400">
                Cancel
              </button>
            </div>
          </div>
        )}
      </InfoBox>

      {journeyData.existingEmergencyFundInstitution && !isEditing && (
        <div className="bg-primary-50 border border-primary-300 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-primary-900 mb-3">Your Saved Emergency Fund Details</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-primary-600">Institution:</dt>
              <dd className="font-semibold text-primary-900">{journeyData.existingEmergencyFundInstitution}</dd>
            </div>
            {journeyData.existingEmergencyFundType && (
              <div className="flex justify-between">
                <dt className="text-primary-600">Account Type:</dt>
                <dd className="font-semibold text-primary-900">{accountTypeLabel(journeyData.existingEmergencyFundType)}</dd>
              </div>
            )}
            {journeyData.existingEmergencyFundAmount > 0 && (
              <div className="flex justify-between">
                <dt className="text-primary-600">Amount:</dt>
                <dd className="font-semibold text-primary-900">
                  ${Number(journeyData.existingEmergencyFundAmount).toLocaleString()}
                </dd>
              </div>
            )}
          </dl>
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
            {(goal / (journeyData.monthlyExpenses || 1)).toFixed(1)} months of expenses
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
