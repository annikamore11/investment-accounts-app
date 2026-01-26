import React, { useState } from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'
import { Building2, Target, DollarSign, Calendar, Edit2, CheckCircle } from 'lucide-react'

const InvestmentSummary = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, direction, transitionTo } = useStepTransition()

  // Get investment goal data
  const goal = journeyData.investingGoals?.[0] || {}

  // Non-retirement institution (separate from emergency fund institution)
  const [institution, setInstitution] = useState(
    journeyData.nonRetirementInstitution || 'Fidelity Investments'
  )
  const [isEditingInstitution, setIsEditingInstitution] = useState(false)
  const [tempInstitution, setTempInstitution] = useState(institution)

  const handleSaveInstitution = () => {
    setInstitution(tempInstitution)
    updateJourneyData('nonRetirementInstitution', tempInstitution)
    setIsEditingInstitution(false)
  }

  const handleCancelEdit = () => {
    setTempInstitution(institution)
    setIsEditingInstitution(false)
  }

  const handleNext = () => {
    transitionTo(nextStep, 'forward')
  }

  const handleBack = () => {
    transitionTo(prevStep, 'backward')
  }

  return (
    <StepContainer
      title="Your Investment Plan Summary"
      subtitle="Review your non-retirement investment setup"
      isExiting={isExiting}
      direction={direction}
    >
      <div className="space-y-6">
        {/* Success message for using Fidelity */}
        <div className="bg-green-50 rounded-lg p-5 border border-green-200">
          <div className="flex gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">Great news!</h3>
              <p className="text-sm text-gray-700">
                Since you already use Fidelity for your emergency fund, you can easily set up Fidelity Go for your investment goals using the same account.
              </p>
            </div>
          </div>
        </div>

        {/* Summary table */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">Your Investment Details</h3>

          <div className="space-y-4">
            {/* Financial Institution */}
            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3 flex-1">
                  <Building2 className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Financial Institution</p>
                    {isEditingInstitution ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={tempInstitution}
                          onChange={(e) => setTempInstitution(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-accent-green-300 rounded-lg focus:border-accent-green-500 focus:outline-none"
                          placeholder="Enter institution name"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveInstitution}
                            className="px-3 py-1.5 bg-accent-green-600 text-white text-sm rounded-lg hover:bg-accent-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1.5 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-base font-semibold text-gray-900">{institution}</p>
                    )}
                  </div>
                </div>
                {!isEditingInstitution && (
                  <button
                    onClick={() => setIsEditingInstitution(true)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit institution"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Investment Goal */}
            <div className="pb-4 border-b border-gray-200">
              <div className="flex gap-3">
                <Target className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Primary Investment Goal</p>
                  <p className="text-base font-semibold text-gray-900">{goal.name || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Target Amount */}
            <div className="pb-4 border-b border-gray-200">
              <div className="flex gap-3">
                <DollarSign className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Target Amount</p>
                  <p className="text-base font-semibold text-gray-900">
                    {goal.amount ? `$${parseInt(goal.amount).toLocaleString()}` : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeframe */}
            <div>
              <div className="flex gap-3">
                <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Time Horizon</p>
                  <p className="text-base font-semibold text-gray-900">
                    {goal.timeframe ?
                      (goal.timeframe === 'none' ? 'No specific timeline' :
                       goal.timeframe === '<1' ? 'Less than 1 year' :
                       `${goal.timeframe} years`)
                      : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next steps info */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-700">
            <strong>Next:</strong> You can continue to set up Fidelity Go for professional investment management, or proceed to the next section of your financial journey.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation
        onBack={handleBack}
        onNext={handleNext}
        canGoNext={true}
        nextLabel="Continue →"
        isExiting={isExiting}
      />
    </StepContainer>
  )
}

export default InvestmentSummary
