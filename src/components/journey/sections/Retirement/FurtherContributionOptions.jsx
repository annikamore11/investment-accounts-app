'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import StepContainer from '@/components/ui/StepContainer'
import useStepTransition from '@/hooks/useStepTransition'

const RetirementOptionsPage = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()
  const [open, setOpen] = useState(false)
  const user = Number(journeyData.userContribution) || 0

  // Opting into the Roth IRA adds a step, so record it before advancing
  const answer = (wantsIRA) => {
    updateJourneyData('wantstoopenIRA', wantsIRA)
    transitionTo(nextStep)
  }

  return (
    <StepContainer title="We Recommend Two Options" isExiting={isExiting}>
      <div className="space-y-6 text-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-accent-green-700 mb-3">Increase Your 401(k) Contribution</h2>
            <p className="text-primary-900">You currently contribute {user}% to your 401(k).</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-accent-green-700 mb-3">Open a Roth IRA</h2>
            <p className="text-primary-900">Start building tax-free retirement savings.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="relative w-full bg-white rounded-xl border border-primary-300 p-4 flex justify-center items-center"
        >
          <span className="text-xl font-bold text-accent-green-700">Which option is better for me?</span>
          <ChevronDown
            className={`h-5 w-5 text-primary-700 transition-transform absolute right-4 top-1/2 -translate-y-1/2 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div className="text-left bg-white border border-primary-200 p-4 rounded-xl animate-fadeIn">
            <p className="text-sm text-primary-800 mb-3">The best option depends on a few factors:</p>
            <ul className="list-disc pl-5 text-sm text-primary-800 space-y-2">
              <li><strong>Increase your 401(k)</strong> if you aren&apos;t getting the full employer match yet.</li>
              <li><strong>Open a Roth IRA</strong> if you want tax-free withdrawals later.</li>
              <li>You can do both — many people contribute to a 401(k) <em>and</em> a Roth IRA.</li>
            </ul>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button onClick={prevStep} disabled={isExiting} className="btn-journey-back flex-none px-6 py-3">
            ← Back
          </button>
          <button onClick={() => answer(false)} disabled={isExiting} className="flex-1 btn-journey-back px-6 py-3">
            Skip Roth IRA — I&apos;ll increase my 401(k) contribution
          </button>
          <button onClick={() => answer(true)} disabled={isExiting} className="flex-1 btn-journey-next px-6 py-3">
            Continue to Roth IRA section →
          </button>
        </div>
      </div>
    </StepContainer>
  )
}

export default RetirementOptionsPage
