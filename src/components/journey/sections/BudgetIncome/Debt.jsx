'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import StepContainer from '@/components/ui/StepContainer'
import OptionGrid from '@/components/ui/OptionGrid'
import StepNavigation from '@/components/ui/StepNavigation'
import DollarInput from '@/components/ui/DollarInput'
import InfoBox from '@/components/ui/InfoBox'
import useStepTransition from '@/hooks/useStepTransition'

const DEBT_TYPES = ['Credit Card', 'Car Loan', 'Student Loan', 'Personal Loan', 'Medical Debt', 'Other']
const HAS_DEBT_OPTIONS = [
  { value: false, label: 'No' },
  { value: true, label: 'Yes' },
]

const emptyDebt = () => ({ name: DEBT_TYPES[0], balance: '', apr: '', minPayment: '' })

const Debt = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [hasDebt, setHasDebt] = useState(journeyData.hasDebt ?? null)
  const [debts, setDebts] = useState(journeyData.debts?.length ? journeyData.debts : [emptyDebt()])
  const { isExiting, transitionTo } = useStepTransition()

  const updateDebt = (index, field, value) => {
    setDebts(prev => prev.map((d, i) => (i === index ? { ...d, [field]: value } : d)))
  }
  const addDebt = () => setDebts(prev => [...prev, emptyDebt()])
  const removeDebt = (index) => setDebts(prev => prev.filter((_, i) => i !== index))

  const validDebts = debts.filter(d => parseFloat(d.balance) > 0)
  const isComplete = hasDebt === false || (hasDebt === true && validDebts.length > 0)

  const handleNext = () => {
    updateJourneyData('hasDebt', hasDebt)
    updateJourneyData(
      'debts',
      hasDebt
        ? validDebts.map(d => ({
            name: d.name || 'Debt',
            balance: parseFloat(d.balance) || 0,
            apr: parseFloat(d.apr) || 0,
            minPayment: parseFloat(d.minPayment) || 0,
          }))
        : []
    )
    transitionTo(nextStep)
  }

  return (
    <StepContainer
      title="Debt"
      subtitle="Not counting a mortgage — credit cards, car loans, student loans, that kind of thing. Don't add these to your expenses on the last page — we'll fold your minimum payments into your budget automatically."
      isExiting={isExiting}
    >
      <InfoBox
        type="why"
        message="High-interest debt (credit cards especially) usually costs more than investing earns you back, so paying it off often comes before investing. We'll factor this into your plan."
      />

      <OptionGrid options={HAS_DEBT_OPTIONS} selectedValue={hasDebt} onChange={setHasDebt} />

      {hasDebt === true && (
        <div className="space-y-4 mb-6 animate-fadeIn">
          {debts.map((debt, index) => (
            <div key={index} className="bg-white rounded-xl p-4 border-2 border-primary-300 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <select
                  value={debt.name}
                  onChange={(e) => updateDebt(index, 'name', e.target.value)}
                  className="flex-1 p-2 border-2 border-primary-300 rounded-lg focus:border-accent-green-600 focus:outline-none font-semibold text-primary-900 bg-white"
                >
                  {DEBT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {debts.length > 1 && (
                  <button
                    onClick={() => removeDebt(index)}
                    aria-label="Remove this debt"
                    className="p-2 text-rust-500 hover:bg-rust-50 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-primary-600 mb-1">Balance</label>
                  <DollarInput value={debt.balance} onChange={(v) => updateDebt(index, 'balance', v)} placeholder="4000" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-primary-600 mb-1">Interest rate (APR)</label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="22"
                      value={debt.apr}
                      onChange={(e) => updateDebt(index, 'apr', e.target.value.replace(/[^\d.]/g, ''))}
                      className="w-full p-4 border-2 border-primary-300 rounded-xl focus:border-accent-green-600 focus:outline-none text-lg font-bold text-primary-900"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-500 font-semibold">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-primary-600 mb-1">Min. payment / mo</label>
                  <DollarInput value={debt.minPayment} onChange={(v) => updateDebt(index, 'minPayment', v)} placeholder="120" />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addDebt}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-primary-300 rounded-lg text-primary-600 hover:border-accent-green-500 hover:text-accent-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add another debt
          </button>
        </div>
      )}

      <StepNavigation
        onBack={prevStep}
        onNext={handleNext}
        canGoNext={isComplete}
        isExiting={isExiting}
      />

      {hasDebt === true && !isComplete && (
        <p className="text-sm text-primary-500 text-center mt-4 animate-fadeIn">
          Enter at least a balance for one debt to continue
        </p>
      )}
    </StepContainer>
  )
}

export default Debt
