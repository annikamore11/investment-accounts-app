'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, X, ShieldCheck } from 'lucide-react'
import StepNavigation from '@/components/ui/StepNavigation'
import GlossaryTerm from '@/components/ui/GlossaryTerm'
import useStepTransition from '@/hooks/useStepTransition'

const FIDELITY_OPEN_ACCOUNT_URL = 'https://www.fidelity.com/open-account/overview'
const FIDELITY_PHONE = '1-800-343-3548'

// Linking instructions differ by how the bank verifies accounts
const BANK_LINK_STEPS = {
  large: {
    instructions: [
      'Log in to Fidelity',
      'Go to "Accounts & Trade" → "Transfers"',
      'Click "Link a Bank Account"',
      'Select your bank from the list (Chase, Bank of America, Wells Fargo, etc.)',
      'Log in with your online banking credentials',
      "Instant verification - you're done!",
    ],
  },
  regional: {
    instructions: [
      'Log in to Fidelity',
      'Go to "Accounts & Trade" → "Transfers"',
      'Click "Link a Bank Account"',
      'Try searching for your bank first',
      'If not found, select "Manual Entry"',
      'Enter your routing number (9 digits) and account number',
      'Fidelity will send 2 small deposits to verify (1-2 business days)',
      'Return to confirm the deposit amounts',
    ],
  },
  unknown: {
    instructions: [
      'Log in to Fidelity',
      'Go to "Accounts & Trade" → "Transfers"',
      'Click "Link a Bank Account"',
      'Search for your bank by name',
      'If found, log in with your online banking credentials',
      'If not found, select "Manual Entry"',
      'Enter routing and account numbers for verification',
    ],
  },
}

// Softened from an unqualified "Your bank supports..." — we're guessing
// from bank size/type, not confirming an actual Plaid lookup, so this
// shouldn't read as a guarantee.
const BANK_NOTICE = {
  large: <><strong>Good news!</strong> Your bank most likely supports instant verification — this should be quick!</>,
  regional: <><strong>Heads up:</strong> Your bank may require manual verification, which takes 1-2 extra days.</>,
}

const buildSteps = ({ bankType, startingAmount, isMovingExisting }) => {
  const isRegional = bankType === 'regional'
  const bankLink = BANK_LINK_STEPS[bankType] || BANK_LINK_STEPS.unknown

  return [
    // Only for someone moving an existing fund over — starting from scratch
    // has no old account to empty out first.
    ...(isMovingExisting
      ? [{
          label: 'Get Money Out',
          title: 'Get Your Money Out of Your Current Account',
          instructions: [
            "If it's in a regular bank, savings, or high-yield savings account: you don't need to withdraw anything first — just link that bank below and transfer straight to Fidelity.",
            "If it's invested in a money market fund or other brokerage account: log in to that account, sell or redeem the position (or move it to the account's cash/settlement balance), then initiate a transfer out to your linked bank account.",
            'Wait for the funds to land in your bank account — this typically takes 1-3 business days.',
            'Once the money is sitting in your bank account, come back here and continue below.',
          ],
          trustNote: "Nothing needs to happen at Fidelity yet — this step is just about freeing up the cash at your current bank or brokerage so it's ready to move.",
        }]
      : []),
    {
      label: 'Prepare',
      title: "What You'll Need",
      listHeading: 'What to gather:',
      instructions: [
        'Social Security Number (for identity verification)',
        "Government-issued ID (driver's license or passport)",
        bankType === 'large'
          ? 'Your online banking login (to easily transfer funds between accounts)'
          : isRegional
            ? 'Bank routing and account numbers (likely needed)'
            : 'Bank login OR routing/account numbers',
        'Current address and contact info',
        'Employment details (employer name and address)',
        'Email and phone number',
      ],
      // Shown prominently on this step specifically, not as one bullet
      // buried in a generic notes list — this is the first place someone
      // sees "Social Security Number" on this page, and the trust question
      // ("wait, is this app collecting that?") needs answering right there.
      trustNote: "We don't collect or store any of this. It goes directly into Fidelity's own secure account-opening form — never through us. This list is just so you have everything ready before you start.",
    },
    {
      label: 'Open Account',
      title: 'Open a Fidelity Account',
      instructions: [
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
        'Select "Brokerage Account"',
        'Fill in your personal information',
        <>
          When asked about &quot;Core Position&quot;, select{' '}
          <GlossaryTerm term="Fidelity Government Money Market Fund (SPAXX)">
            <div className="space-y-2">
              <p className="font-semibold text-primary-900">What is SPAXX?</p>
              <p>
                SPAXX is Fidelity&apos;s government money market fund. It&apos;s a very safe investment that
                essentially acts the same as a high yield savings account.
              </p>
              <p>
                When you choose SPAXX as your core position, any uninvested cash in your account automatically
                goes into this fund and earns interest (typically 2-5% annually), instead of sitting idle earning
                nothing.
              </p>
              <p className="text-primary-600 text-xs border-t border-primary-200 pt-2 mt-2">
                This is perfect for your emergency fund because it&apos;s safe, liquid (you can access your money
                anytime), and earns much more than a typical bank account.
              </p>
            </div>
          </GlossaryTerm>
        </>,
        'Review and submit your application',
      ],
    },
    {
      label: 'Link Bank',
      title: 'Link Your Bank',
      instructions: bankLink.instructions,
    },
    {
      label: 'Transfer',
      title: 'Transfer Money',
      instructions: [
        ...(isRegional ? ['Wait for bank verification if using manual entry (1-2 days)'] : []),
        'Once your bank is linked, go to "Transfers" in the top left corner',
        'Select "EFT to or from a bank"',
        'Select your bank in the "From" box',
        'Select "Individual" in the "To" box',
        'Choose "One-time transfer" for now',
        `Enter amount: $${startingAmount.toLocaleString()}`,
        'Submit (money arrives in 1-3 business days)',
      ],
    },
    {
      // A dedicated step, not a footnote on Transfer — seeing a real dollar
      // amount leave your bank raises "wait, can I get this back?" clearly
      // enough that it deserves its own answer, not a line easy to skim
      // past on the way to the Next button.
      label: 'Access Anytime',
      title: 'How Do I Get My Money Back When I Need It?',
      instructions: [
        'Go to "Transfers" in the top left corner — the same place you transferred money in',
        'Select "EFT to or from a bank"',
        'This time, select Fidelity in the "From" box',
        'Select your bank in the "To" box',
        'Choose "One-time transfer" and enter however much you want back',
        'Submit — money typically arrives in 1-3 business days',
      ],
      trustNote: "Nothing here is locked in. This is the exact same screen you used to move money in, just reversed — you can do this any time, for any amount, as many times as you need. Your emergency fund is there for emergencies, and \"getting the money out\" is never a separate hurdle.",
    },
  ]
}

const Dismissible = ({ onDismiss, className, children }) => (
  <div className={`relative rounded-xl p-4 mb-6 ${className}`}>
    <button
      onClick={onDismiss}
      className="absolute top-2 right-2 p-1 hover:bg-black/5 rounded transition-colors"
      aria-label="Dismiss"
    >
      <X className="w-4 h-4" />
    </button>
    <div className="pr-8">{children}</div>
  </div>
)

const FidelitySetupGuide = ({ journeyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()
  const [stepIndex, setStepIndex] = useState(0)
  const [showBankNotice, setShowBankNotice] = useState(true)
  // Purely a personal tracking aid for the "what to gather" checklist —
  // checking an item off doesn't feed into journeyData or gate navigation,
  // it's just there for someone who wants to tick things off as they find
  // them. Keyed by index within whichever step renders as a checklist, and
  // deliberately not reset on step navigation so ticks survive Next/Previous.
  const [checkedItems, setCheckedItems] = useState(() => new Set())
  const toggleChecked = (index) => {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const bankType = journeyData.bankType || 'unknown'
  const isMovingExisting = journeyData.hasEmergencyFund === true && journeyData.moveToFidelity === true
  const steps = buildSteps({
    bankType,
    startingAmount: journeyData.emergencyFundCurrentAmount || 0,
    isMovingExisting,
  })
  const step = steps[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === steps.length - 1

  return (
    <div
      className={`w-full max-w-4xl mx-auto px-4 md:px-0 transition-all duration-500 ${
        isExiting ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-100 mb-3">
          {isMovingExisting ? 'Move Your Emergency Fund to Fidelity' : 'Fidelity Setup Guide'}
        </h1>
        <p className="text-base md:text-lg text-primary-200 max-w-4xl mx-auto">
          {isMovingExisting
            ? `${steps.length} simple steps to move your emergency fund to Fidelity`
            : `${steps.length} simple steps to get your emergency fund earning interest`}
        </p>
      </div>

      <div className="bg-primary-100 rounded-xl shadow-xl p-4 md:p-8 lg:p-12">
        {BANK_NOTICE[bankType] && showBankNotice && (
          <Dismissible onDismiss={() => setShowBankNotice(false)} className="bg-accent-green-50 border border-accent-green-300 text-accent-green-900">
            <p className="text-sm">{BANK_NOTICE[bankType]}</p>
          </Dismissible>
        )}

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, index) => {
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
                {index < steps.length - 1 && (
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

          <div className="bg-white border border-primary-300 rounded-lg p-4 md:p-6 mb-4">
            <h3 className="font-semibold text-primary-900 mb-3">{step.listHeading || 'Instructions:'}</h3>
            {step.listHeading ? (
              // A "what to gather" checklist, not a sequence — checkable
              // because these are independent items to track down, in any
              // order, not ordered actions like the other steps' lists.
              // Purely optional self-tracking (see checkedItems above).
              <ul className="space-y-2">
                {step.instructions.map((instruction, i) => {
                  const checked = checkedItems.has(i)
                  return (
                    <li key={i}>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleChecked(i)}
                          className="mt-0.5 w-5 h-5 shrink-0 rounded border-2 border-primary-300 accent-accent-green-600 cursor-pointer"
                        />
                        <span
                          className={`text-sm md:text-base transition-colors ${
                            checked ? 'text-primary-400 line-through' : 'text-primary-700'
                          }`}
                        >
                          {instruction}
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            ) : (
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
            )}
          </div>

          {step.trustNote && (
            <div className="bg-accent-green-50 border border-accent-green-300 rounded-lg p-4 flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 text-accent-green-600 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-accent-green-900">{step.trustNote}</p>
            </div>
          )}
        </div>

        {/* Sub-step arrows — Next is the deliberate primary action here
            (solid, not the same neutral tone as Previous) so it reads as
            the way to move forward instead of blending into the rest of
            the page. */}
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
            {steps.map((s, index) => (
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
            <strong>Need help?</strong> Call Fidelity 24/7: {FIDELITY_PHONE}
          </p>
        </div>

        <StepNavigation
          onBack={prevStep}
          onNext={() => transitionTo(nextStep)}
          isExiting={isExiting}
          nextLabel="Continue to Next Section →"
        />
      </div>
    </div>
  )
}

export default FidelitySetupGuide
