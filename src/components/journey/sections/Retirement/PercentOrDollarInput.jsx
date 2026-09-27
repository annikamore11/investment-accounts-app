'use client'

import { useState } from 'react'
import { Percent } from 'lucide-react'
import { getPerPaycheckDollarsForPercent, getPercentForPerPaycheckDollars } from '@/utils/retirementMath'

// Digits plus at most one decimal point and one digit after it — 401(k)
// and Roth IRA contribution rates are commonly fractional (e.g. 4.5%), so
// stripping '.' entirely (the old behavior) silently blocked real values.
export const sanitizePercentText = (raw) => {
  let cleaned = raw.replace(/[^\d.]/g, '')
  const dot = cleaned.indexOf('.')
  if (dot !== -1) {
    cleaned = cleaned.slice(0, dot + 1) + cleaned.slice(dot + 1).replace(/\./g, '')
    cleaned = cleaned.slice(0, dot + 2)
  }
  return cleaned
}

const percentToDollarText = (journeyData, percentText) =>
  percentText === '' ? '' : String(getPerPaycheckDollarsForPercent(journeyData, Number(percentText) || 0))

const dollarToPercentText = (journeyData, dollarText) =>
  dollarText === '' ? '' : String(Math.round(getPercentForPerPaycheckDollars(journeyData, Number(dollarText) || 0) * 10) / 10)

// journeyData always stores the canonical value as a percent (matching
// every other field this feeds — getContributionSummary, the combined
// savings math, etc.) — this just lets someone type in dollars-per-paycheck
// instead and converts it behind the scenes, so nothing downstream has to
// know which unit was actually typed.
//
// Percent and dollar text are tracked as independent local state rather
// than one derived from the other on every keystroke — round-tripping a
// small dollar amount through a percent rounded to one decimal place can
// land back on "0", which made the dollar field appear to reject digits
// like "1" the instant they were typed. Each mode's text field is only
// resynced from the other when the mode is actually switched.
const PercentOrDollarInput = ({ label, value, onChange, journeyData, placeholderPercent, placeholderDollar }) => {
  const [mode, setMode] = useState('percent')
  const [percentText, setPercentText] = useState(value ?? '')
  const [dollarText, setDollarText] = useState(() => percentToDollarText(journeyData, value ?? ''))

  const switchMode = (next) => {
    if (next === mode) return
    if (next === 'dollar') {
      setDollarText(percentToDollarText(journeyData, percentText))
    } else {
      setPercentText(dollarToPercentText(journeyData, dollarText))
    }
    setMode(next)
  }

  const handlePercentChange = (raw) => {
    const sanitized = sanitizePercentText(raw)
    setPercentText(sanitized)
    onChange(sanitized)
  }

  const handleDollarChange = (raw) => {
    const sanitized = raw.replace(/[^\d]/g, '')
    setDollarText(sanitized)
    onChange(dollarToPercentText(journeyData, sanitized))
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <label className="text-lg sm:text-xl font-semibold text-primary-700">{label}</label>
        <div className="flex rounded-lg border-2 border-primary-300 overflow-hidden shrink-0 text-sm font-semibold">
          <button
            type="button"
            onClick={() => switchMode('percent')}
            className={`px-3 py-1.5 transition-colors ${mode === 'percent' ? 'bg-accent-green-600 text-white' : 'bg-white text-primary-600 hover:bg-primary-50'}`}
          >
            %
          </button>
          <button
            type="button"
            onClick={() => switchMode('dollar')}
            className={`px-3 py-1.5 transition-colors ${mode === 'dollar' ? 'bg-accent-green-600 text-white' : 'bg-white text-primary-600 hover:bg-primary-50'}`}
          >
            $
          </button>
        </div>
      </div>

      <div className="relative max-w-xs mx-auto">
        {mode === 'percent' ? (
          <>
            <input
              type="text"
              inputMode="decimal"
              placeholder={placeholderPercent}
              value={percentText}
              onChange={(e) => handlePercentChange(e.target.value)}
              className="w-full border-2 border-primary-300 rounded-xl px-4 py-3 text-lg font-bold text-primary-900 bg-white focus:outline-none focus:border-accent-green-500"
            />
            <Percent className="absolute right-4 top-3.5 text-primary-500 w-5 h-5" />
          </>
        ) : (
          <>
            <span className="absolute left-4 top-3.5 text-primary-500 text-lg font-bold">$</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder={placeholderDollar}
              value={dollarText}
              onChange={(e) => handleDollarChange(e.target.value)}
              className="w-full border-2 border-primary-300 rounded-xl pl-8 pr-4 py-3 text-lg font-bold text-primary-900 bg-white focus:outline-none focus:border-accent-green-500"
            />
          </>
        )}
      </div>

      {mode === 'percent' && percentText !== '' && (
        <p className="text-sm text-primary-500 text-center mt-2">
          ≈ ${percentToDollarText(journeyData, percentText)} per paycheck
        </p>
      )}
      {mode === 'dollar' && dollarText !== '' && (
        <p className="text-sm text-primary-500 text-center mt-2">
          ≈ {dollarToPercentText(journeyData, dollarText)}% of your salary
        </p>
      )}
    </div>
  )
}

export default PercentOrDollarInput
