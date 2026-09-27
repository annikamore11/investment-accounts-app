'use client'

import { useState } from 'react'
import Link from 'next/link'
import StepContainer from '@/components/ui/StepContainer'
import OptionGrid from '@/components/ui/OptionGrid'
import StepNavigation from '@/components/ui/StepNavigation'
import GlossaryTerm from '@/components/ui/GlossaryTerm'
import useStepTransition from '@/hooks/useStepTransition'
import { ExternalLink, Wallet } from 'lucide-react'
import { FIDELITY } from './accountTypes'

// Merged with what was a separate "Account Options" education step:
// explaining what a high-yield account is and the yes/no question belong on
// the same page, not two steps, since the explanation exists purely to make
// the question below easier to answer. No benefits-grid stat cards (FDIC
// insured / competitive rate / no minimum) — those were specific to
// Fidelity's SPAXX and don't hold for every high-yield account someone
// might already have, so stating them as general facts here would be
// misleading.
const EmergencyFundAmount = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [hasEmergencyFund, setHasEmergencyFund] = useState(journeyData.hasEmergencyFund ?? null)
  const { isExiting, transitionTo } = useStepTransition()

  const handleNext = () => {
    updateJourneyData('hasEmergencyFund', hasEmergencyFund)
    if (hasEmergencyFund === false) {
      updateJourneyData('emergencyFundAccountType', 'money-market')
      updateJourneyData('emergencyFundInstitution', FIDELITY)
      // Only meaningful for the "already have one" branch — dropped here so
      // a stale answer can't linger if they change their answer later.
      updateJourneyData('moveToFidelity', null)
    }
    transitionTo(nextStep)
  }

  const options = [
    {
      value: true,
      label: 'Yes',
      description: 'I already have one set up — at Fidelity or somewhere else'
    },
    {
      value: false,
      label: 'No',
      description: 'Help me learn more and set one up'
    }
  ]

  const goal = journeyData.emergencyFundGoal || 0

  return (
    <StepContainer
      title="Where To Keep Your Emergency Fund"
      subtitle={goal > 0 ? `Working toward your $${goal.toLocaleString()} goal` : undefined}
      isExiting={isExiting}
    >
      {/* Education */}
      <div className="bg-gradient-to-br from-accent-green-50 via-white to-primary-50 rounded-2xl p-6 mb-6 border border-accent-green-100">
        <div className="flex items-start gap-3">
          <div className="bg-accent-green-100 p-2.5 rounded-xl flex-shrink-0">
            <Wallet className="w-5 h-5 text-accent-green-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary-900 mb-1.5">
              A High-Yield Account, Ideally at Fidelity
            </h3>
            <div className="text-sm text-primary-700 leading-relaxed">
              A{' '}
              <GlossaryTerm term="high-yield account">
                <div className="space-y-2">
                  <p className="font-semibold text-primary-900">What is a high-yield account?</p>
                  <p>A high-yield account is a very safe place to keep your money while still earning a return, usually between <strong>2-5% annually</strong>.</p>
                  <p className="text-primary-600 text-xs border-t border-primary-200 pt-2 mt-2">
                    Compare this to typical bank accounts which usually give you less than 1% return—your money actually loses value to inflation over time.
                  </p>
                </div>
              </GlossaryTerm>
              {' '}is where your emergency fund can grow safely while staying accessible. If you don't already
              have one, we'll help you open one with Fidelity in the next few steps.
            </div>
          </div>
        </div>
      </div>

      {/* Why Fidelity */}
      <div className="bg-primary-50 rounded-xl p-4 mb-6 border border-primary-100">
        <p className="font-semibold text-primary-900 text-sm mb-1.5">
          Why Fidelity?
        </p>
        <p className="text-sm text-primary-700 leading-relaxed">
          Keep your emergency fund, retirement accounts, and investments all in one dashboard for simpler financial management.
        </p>
      </div>

      {/* Other options link */}
      <div className="text-center mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-accent-green-700 transition-colors group"
        >
          <span className="underline decoration-dotted">Explore other account options</span>
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* The question */}
      <div className="mb-8">
        <label className="block text-lg sm:text-xl font-semibold text-primary-700 mb-4">
          Do you already have an emergency fund set up, either at Fidelity or elsewhere?
        </label>

        <OptionGrid
          options={options}
          selectedValue={hasEmergencyFund}
          onChange={setHasEmergencyFund}
        />
      </div>

      <StepNavigation
        onBack={prevStep}
        onNext={handleNext}
        canGoNext={hasEmergencyFund !== null}
        isExiting={isExiting}
      />
    </StepContainer>
  )
}

export default EmergencyFundAmount
