'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react'
import StepNavigation from '@/components/ui/StepNavigation'
import OptionGrid from '@/components/ui/OptionGrid'
import GlossaryTerm from '@/components/ui/GlossaryTerm'
import useStepTransition from '@/hooks/useStepTransition'

const FIDELITY_OPEN_ACCOUNT_URL = 'https://www.fidelity.com/open-account/overview'

const NEEDS_ACCOUNT_OPTIONS = [
  { value: true, label: 'Yes, walk me through it' },
  { value: false, label: 'No, I already have one' },
]

// You can't transfer money into a Fidelity Roth IRA that doesn't exist yet
// — this has to happen before the rest of "Start the Transfer" makes
// sense, so it's asked right there instead of assumed away in a bullet.
const OPEN_ACCOUNT_STEPS = [
  <>
    Go to{' '}
    <a
      href={FIDELITY_OPEN_ACCOUNT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent-green-600 hover:text-accent-green-700 underline font-semibold"
    >
      Fidelity.com
    </a>{' '}
    and click &quot;Open an Account&quot;
  </>,
  'Select "Retirement & IRAs then choose "Roth IRA"',
  'Review your information and submit — opening the account itself only takes a few minutes',
  'Once it\'s open, come back here and use your new account number for the transfer below',
]

// Same tabbed-wizard shape as RothIn401kSetupGuide.jsx. Content here is
// specifically about a trustee-to-trustee ("transfer of assets") move
// between two Roth IRAs, not a 60-day rollover — that's what makes it
// allowed without limit or tax consequence (verified against irs.gov and
// fidelity.com), though that distinction isn't spelled out as its own tab.
const STEPS = [
  {
    label: 'Start the Transfer',
    title: 'How to Actually Move It',
    needsAccountFirst: true,
    instructionsHeading: 'Then, submit the request:',
    instructions: [
      'Log in to Fidelity.com and go to "Accounts & Trade" → "Transfers."',
      'Click "Move an account to Fidelity"',
      'Scroll down and click"Start a transfer."',
      "Select the financial company your Roth IRA is currently with, or search for it if it's not listed.",
      "Enter your institution's account number",
      'Select the Fidelity Roth IRA you want the money to land in.',
      'Confirm the account type as "Roth IRA" — Fidelity automatically matches Roth-to-Roth transfers.',
      'Choose "Full transfer" to move everything, or "Partial transfer" for just part of it.',
      'Review and submit — the request itself takes about 5–7 minutes.',
    ],
    trustNote: "You initiate this from Fidelity's side — you never have to call your old provider yourself or handle a check. Track progress anytime from the same Transfers page, and watch for a confirmation email once the assets arrive, typically in 3–5 business days.",
  },
  {
    label: 'Confirm',
    title: 'Check What Landed — and Invest Any Cash',
    instructions: [
      'Once the transfer completes, log in to Fidelity and confirm the full balance you expected actually arrived.',
      "Check whether everything transferred in-kind, or if some of it landed as cash instead — that happens automatically when a holding can't transfer as-is, like a fund proprietary to your old firm or a stock trading under $1 a share.",
      'Any cash sits in your core position (a money market fund) earning a little interest, but it isn\'t actually invested for retirement growth until you choose something — a target-date fund matching roughly the year you expect to retire (e.g. "Fidelity Freedom Index 2060 Fund") is the simplest single-fund option, or a low-cost S&P 500/total market index fund if you\'d rather keep it simple.',
      'Confirm your old account shows a zero balance and is closed (or ask your old institution to confirm) — some charge a small account-closure or transfer-out fee, which is normal and separate from the transfer itself.',
      "If anything looks off, Fidelity's transfer team can look into it — that's exactly what they're there for.",
    ],
    trustNote: "A quick check here confirms years of contributions and growth landed exactly where they should — and that none of it is sitting idle by accident.",
  },
]

const RothIraTransferGuide = ({ nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()
  const [stepIndex, setStepIndex] = useState(0)
  // Purely local — not everyone starting a transfer needs this, so it's
  // asked rather than assumed, but there's nothing here worth persisting
  // to journeyData once they've moved past this step.
  const [needsHelpOpening, setNeedsHelpOpening] = useState(null)

  const step = STEPS[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === STEPS.length - 1

  return (
    <div
      className={`w-full max-w-4xl mx-auto px-4 md:px-0 transition-all duration-500 ${
        isExiting ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-100 mb-3">
          Transfer Your Roth IRA to Fidelity
        </h1>
        <p className="text-base md:text-lg text-primary-200 max-w-4xl mx-auto">
          {STEPS.length} steps to move your existing Roth IRA over
        </p>
      </div>

      <div className="bg-primary-100 rounded-xl shadow-xl p-4 md:p-8 lg:p-12">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, index) => {
            const isActive = index === stepIndex
            const isPast = index < stepIndex
            return (
              <div key={s.label} className="flex-1 relative">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setStepIndex(index)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all relative z-10 ${
                      isActive
                        ? 'bg-accent-green-600 text-white ring-4 ring-accent-green-200'
                        : isPast
                          ? 'bg-accent-green-400 text-white'
                          : 'bg-primary-200 text-primary-500'
                    }`}
                  >
                    {index + 1}
                  </button>
                  <span className={`text-xs mt-2 text-center font-medium hidden md:block ${isActive ? 'text-primary-900' : 'text-primary-600'}`}>
                    {s.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="absolute top-5 left-1/2 w-full h-0.5 z-0">
                    <div className={`h-full ${isPast ? 'bg-accent-green-400' : 'bg-primary-300'}`} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Step content */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-primary-900 mb-4">{step.title}</h2>

          {step.needsAccountFirst && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-primary-700 mb-3">
                Do you need help opening a Fidelity Roth IRA first?
              </label>
              <OptionGrid options={NEEDS_ACCOUNT_OPTIONS} selectedValue={needsHelpOpening} onChange={setNeedsHelpOpening} />

              {needsHelpOpening === true && (
                <div className="bg-white border border-primary-300 rounded-lg p-4 md:p-6 mt-4">
                  <h3 className="font-semibold text-primary-900 mb-3">Opening a Fidelity Roth IRA</h3>
                  <ol className="space-y-2">
                    {OPEN_ACCOUNT_STEPS.map((instruction, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <span className="shrink-0 w-6 h-6 bg-primary-200 text-primary-700 rounded-full flex items-center justify-center text-sm font-semibold">
                          {i + 1}
                        </span>
                        <span className="text-primary-700 text-sm md:text-base">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {needsHelpOpening === false && (
                <p className="text-sm text-primary-600 mt-3">
                  Good — here&apos;s how to start the actual transfer once your account&apos;s ready:
                </p>
              )}
            </div>
          )}

          <div className="bg-white border border-primary-300 rounded-lg p-4 md:p-6 mb-4">
            {step.points && (
              <>
                {step.pointsHeading && <h3 className="font-semibold text-primary-900 mb-2">{step.pointsHeading}</h3>}
                {/* Things to gather, not ordered actions — a bullet list
                    rather than numbered steps. */}
                <ul className={`list-disc pl-5 space-y-2 ${step.instructions ? 'mb-5' : ''}`}>
                  {step.points.map((point, i) => (
                    <li key={i} className="text-primary-700 text-sm md:text-base">{point}</li>
                  ))}
                </ul>
              </>
            )}
            {step.instructions && (
              <>
                {step.instructionsHeading && <h3 className="font-semibold text-primary-900 mb-2">{step.instructionsHeading}</h3>}
                <ol className="space-y-2">
                  {step.instructions.map((instruction, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <span className="shrink-0 w-6 h-6 bg-primary-200 text-primary-700 rounded-full flex items-center justify-center text-sm font-semibold">
                        {i + 1}
                      </span>
                      <span className="text-primary-700 text-sm md:text-base">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>

          {step.trustNote && (
            <div className="bg-accent-green-50 border border-accent-green-300 rounded-lg p-4 flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 text-accent-green-600 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-accent-green-900">{step.trustNote}</p>
            </div>
          )}
        </div>

        {/* Sub-step arrows */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setStepIndex(i => i - 1)}
            disabled={isFirst}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-primary-300 hover:bg-primary-400 text-primary-700 disabled:bg-primary-200 disabled:text-primary-400 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden md:inline">Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            {STEPS.map((s, index) => (
              <button
                key={s.label}
                onClick={() => setStepIndex(index)}
                aria-label={`Go to ${s.label}`}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === stepIndex ? 'bg-accent-green-600' : index < stepIndex ? 'bg-accent-green-400' : 'bg-primary-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setStepIndex(i => i + 1)}
            disabled={isLast}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors bg-accent-green-600 hover:bg-accent-green-700 text-white disabled:bg-primary-200 disabled:text-primary-400 disabled:cursor-not-allowed"
          >
            <span className="hidden md:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-primary-50 border border-primary-300 rounded-lg p-3">
          <p className="text-sm text-primary-700">
            <strong>Every custodian is a little different.</strong> If your old institution asks for
            something not covered here, Fidelity&apos;s transfer team can walk you through it.
          </p>
        </div>

        <StepNavigation
          onBack={prevStep}
          onNext={() => transitionTo(nextStep)}
          isExiting={isExiting}
          nextLabel="Continue →"
        />
      </div>
    </div>
  )
}

export default RothIraTransferGuide
