'use client'

import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'

const RETIREMENT_GOAL_PERCENT = 15

const StatCard = ({ label, value, highlight }) => (
  <div className={`p-4 rounded-xl border ${highlight ? 'bg-rust-100 border-rust-200' : 'bg-primary-100 border-primary-200'}`}>
    <p className="text-sm text-primary-600">{label}</p>
    <p className={`text-2xl font-bold ${highlight ? 'text-rust-700' : 'text-primary-800'}`}>{value}%</p>
  </div>
)

const RetirementOutcomes = ({ journeyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()
  const user = Number(journeyData.userContribution) || 0
  const company = Number(journeyData.companyMatch) || 0
  const total = user + company
  const missingMatch = user < company
  const belowGoal = total < RETIREMENT_GOAL_PERCENT
  const pct = (n) => `${(Math.min(n, RETIREMENT_GOAL_PERCENT) / RETIREMENT_GOAL_PERCENT) * 100}%`

  return (
    <StepContainer title="401(k) Contribution Summary" isExiting={isExiting}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <StatCard label="Your Contribution" value={user} highlight={missingMatch} />
          <StatCard label="Employer Match" value={company} />
          <StatCard label="Total Contribution" value={total} />
        </div>

        <div
          className={`p-4 rounded-lg border text-center ${
            missingMatch ? 'border-rust-700 bg-rust-100 text-rust-700' : 'border-accent-green-500 bg-accent-green-100 text-accent-green-700'
          }`}
        >
          {missingMatch ? (
            <>
              <p className="text-lg font-bold">
                You are contributing less than {company}% — you are losing free money!
              </p>
              <p className="text-sm">Increase contributions by {company - user}% to get your full match.</p>
            </>
          ) : belowGoal ? (
            <p className="text-lg">Great, you are maximizing your company match!</p>
          ) : (
            <p className="text-lg">
              You are maximizing your match AND hitting the {RETIREMENT_GOAL_PERCENT}% benchmark!
            </p>
          )}
        </div>

        {belowGoal && (
          <div className="p-4 rounded-lg border border-rust-700 bg-rust-100 text-center text-lg text-rust-700">
            You are {RETIREMENT_GOAL_PERCENT - total}% away from the {RETIREMENT_GOAL_PERCENT}% goal.
          </div>
        )}

        <div className="space-y-1">
          <div className="flex justify-between text-sm font-semibold text-primary-600">
            <span>Progress Toward {RETIREMENT_GOAL_PERCENT}% Goal</span>
            <span>{total}% / {RETIREMENT_GOAL_PERCENT}%</span>
          </div>
          <div className="relative h-4 w-full bg-primary-100 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-accent-green-500 opacity-60" style={{ width: pct(total) }} />
            <div className="absolute top-0 left-0 h-full bg-accent-green-800" style={{ width: pct(user) }} />
          </div>
          <div className="flex gap-6 text-sm text-primary-600 leading-tight">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent-green-800 rounded-sm" />
              <span>Your Contribution</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent-green-500 rounded-sm opacity-60" />
              <span>Company Match</span>
            </div>
          </div>
        </div>

        <StepNavigation
          onBack={prevStep}
          onNext={() => transitionTo(nextStep)}
          isExiting={isExiting}
          nextLabel="Continue to Next Step →"
          className="mt-0"
        />
      </div>
    </StepContainer>
  )
}

export default RetirementOutcomes
