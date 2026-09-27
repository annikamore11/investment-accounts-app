'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'

// Provider-agnostic on purpose — unlike the EmergencyFund guide, we don't
// know which company administers this person's 401(k) or what funds it
// offers, so every tab has to hold up regardless of provider.
const STEPS = [
  {
    label: 'Turn On Roth',
    title: 'Turn On Roth Contributions',
    instructions: [
      "Log in to your 401(k) provider's website or app — Fidelity, Vanguard, Empower, ADP, Principal, or whoever administers your company's plan.",
      'Look for a section called something like "Contributions," "Deferral Elections," or "Paycheck Contributions."',
      'Look for an option to split your contribution between "Traditional (Pre-Tax)" and "Roth (After-Tax)."',
      'Decide how to split your percentage between Roth and traditional — see the next tab for how to think about that.',
      'Save or submit the change — it usually takes effect on your next paycheck, or the one after.',
    ],
    trustNote: "Don't see a Roth option anywhere? That may mean your plan doesn't actually offer it, despite what you thought — contact your HR or benefits team, or call your plan provider directly to confirm before assuming it's just hidden somewhere.",
  },
  {
    label: 'Roth vs. Traditional',
    title: 'How Much Should Be Roth vs. Traditional?',
    points: [
      'Roth: you pay taxes on the money now, then withdrawals in retirement are tax-free.',
      'Traditional: you get a tax break now, and pay taxes when you withdraw in retirement.',
      "Rule of thumb: if you expect to be in a similar or higher tax bracket in retirement — common earlier in your career, when your income (and tax rate) is likely to grow — leaning more Roth tends to pay off.",
      "If you're in a high tax bracket right now and expect a meaningfully lower one in retirement, more traditional can make sense.",
      "It doesn't have to be all-or-nothing — plenty of people split between both to hedge against not knowing future tax rates.",
      'Still not sure? 100% Roth is a reasonable default earlier in your career — you can always adjust the split later.',
    ],
  },
  {
    label: 'Pick Investments',
    title: 'Choosing How to Invest It',
    points: [
      "Turning on Roth only changes the tax treatment of your contributions — you still need to choose what that money is actually invested in from your plan's fund menu.",
      'Look for a target-date fund matching roughly the year you expect to retire (e.g. "Target 2060 Fund") — it\'s the simplest single-fund option, and it automatically adjusts its risk mix over time.',
      'No target-date fund in your plan? A low-cost S&P 500 or total U.S. stock market index fund is a reasonable default for money you won\'t touch for decades.',
      'Watch out for a default "safe" option — many plans automatically put uninvested contributions into a money market or stable-value fund, which barely grows. Fine as a temporary parking spot, costly if left there for years by accident.',
      "Watch out for over-concentration in your employer's stock — a single company's stock is far riskier than a diversified fund; keep it to a small slice of your portfolio if you hold it at all.",
      'If your plan shows an expense ratio for each fund, lower is generally better for a given type of fund.',
      "Every employer's plan has a different fund lineup, so we can't point you to exact fund names here — these principles hold no matter who administers your plan.",
    ],
  },
  {
    label: 'Confirm',
    title: 'Double-Check Your Setup',
    instructions: [
      'After your next paycheck, log back in and confirm your contribution is showing under "Roth," not just "Traditional."',
      'Confirm the percentage matches what you set.',
      "Confirm the money is landing in the funds you picked — not sitting in a default cash or money-market holding.",
      "If anything looks off, that's exactly what HR/benefits or your provider's support line is for.",
    ],
    trustNote: 'This step alone confirms months — or years — of contributions land exactly where you intended. Worth the two minutes.',
  },
]

const RothIn401kSetupGuide = ({ nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()
  const [stepIndex, setStepIndex] = useState(0)

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
          Set Up Your Roth 401(k) Contributions
        </h1>
        <p className="text-base md:text-lg text-primary-200 max-w-4xl mx-auto">
          {STEPS.length} steps to turn on Roth contributions and choose your investments
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

          <div className="bg-white border border-primary-300 rounded-lg p-4 md:p-6 mb-4">
            {step.instructions ? (
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
            ) : (
              // Conceptual/decision content, not a sequence of actions — a
              // bullet list rather than forcing it into numbered steps.
              <ul className="list-disc pl-5 space-y-2">
                {step.points.map((point, i) => (
                  <li key={i} className="text-primary-700 text-sm md:text-base">{point}</li>
                ))}
              </ul>
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
            <strong>Every plan is different.</strong> When in doubt, your HR or benefits team, or your
            plan provider&apos;s support line, can tell you exactly how this works for your plan.
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

export default RothIn401kSetupGuide
