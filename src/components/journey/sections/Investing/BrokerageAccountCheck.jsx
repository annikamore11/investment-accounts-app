'use client'

import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import OptionGrid from '@/components/ui/OptionGrid'
import useStepTransition from '@/hooks/useStepTransition'
import { CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import { accountTypeLabel } from '../EmergencyFund/accountTypes'

const BrokerageAccountCheck = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()
  
  // Prefer the fund they set up in this journey over one they already had
  const institution = journeyData.emergencyFundInstitution || journeyData.existingEmergencyFundInstitution
  const accountType = journeyData.emergencyFundAccountType || journeyData.existingEmergencyFundType

  const isFidelity = institution?.toLowerCase().includes('fidelity')
  const hasFidelityMoneyMarket = isFidelity && accountType?.includes('money-market')
  const hasDifferentInstitution = institution && !isFidelity
  const noInstitution = !institution

  return (
    <StepContainer
      title="Your Brokerage Account"
      subtitle="Let's see what you've already set up"
      isExiting={isExiting}
    >
      <div className="space-y-6">
        {/* Status Display */}
        <div className="bg-primary-50 rounded-xl p-5 border border-primary-200">
          <h3 className="font-semibold text-primary-900 mb-3">Based on information we have collected from the 'Emergency Fund' section:</h3>
          <div className="space-y-2 text-sm text-primary-700">
            <div className="flex justify-between">
              <span className="font-medium">Institution:</span>
              <span>{institution || 'Not set up yet'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Account Type:</span>
              <span>{accountType ? accountTypeLabel(accountType) : 'Not specified'}</span>
            </div>
          </div>
        </div>

        {/* Fidelity Money Market - Already Set Up */}
        {hasFidelityMoneyMarket && (
          <div className="bg-accent-green-50 border-2 border-accent-green-200 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-accent-green-100 p-2 rounded-lg">
                <CheckCircle className="w-6 h-6 text-accent-green-700" />
              </div>
              <div>
                <h4 className="font-bold text-accent-green-900 text-lg mb-2">
                  Great News - You're All Set!
                </h4>
                <p className="text-primary-700 leading-relaxed mb-3">
                  We noticed from your past responses that it looks like you've already set up a Brokerage Account through Fidelity with a Money Market account. This means you're ready to start investing!
                </p>
                <p className="text-primary-700 leading-relaxed">
                  Click "Continue" below to learn the steps to invest in your chosen funds.
                </p>
              </div>
            </div>

            
          </div>
        )}

        {/* Different Institution — an actual question, not just two static
            options to read: capturing the answer is what lets us actually
            act on it (routing to the Fidelity setup guide vs. leaving them
            be), instead of just informing without asking. */}
        {hasDifferentInstitution && (
          <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-primary-100 p-2 rounded-lg">
                <AlertCircle className="w-6 h-6 text-primary-700" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-primary-900 text-lg mb-2">
                  You're Using {institution}
                </h4>
                <p className="text-primary-700 leading-relaxed mb-4">
                  Your emergency fund is with <strong>{institution}</strong>, not Fidelity. Keeping your emergency
                  fund, retirement, and investing on one platform makes your whole financial picture easier to see
                  and manage — but it's completely your call.
                </p>

                <label className="block text-sm font-semibold text-primary-900 mb-3">
                  Want help moving it to Fidelity so everything's in one place?
                </label>
                <OptionGrid
                  options={[
                    {
                      value: true,
                      label: 'Yes, help me consolidate',
                      description: "We'll walk you through opening a Fidelity account and moving your funds over.",
                    },
                    {
                      value: false,
                      label: `No, keep it at ${institution}`,
                      description: 'Totally fine — you can always revisit this later.',
                    },
                  ]}
                  selectedValue={journeyData.wantsFidelityConsolidation}
                  onChange={(value) => updateJourneyData('wantsFidelityConsolidation', value)}
                  className="mb-0"
                />

                {journeyData.wantsFidelityConsolidation === true && (
                  <div className="bg-white rounded-lg p-4 border border-primary-200 mt-4 animate-fadeIn">
                    <p className="text-sm text-primary-700">
                      Great — click &quot;Continue&quot; below and we&apos;ll walk through opening a Fidelity brokerage account next.
                    </p>
                  </div>
                )}
                {journeyData.wantsFidelityConsolidation === false && (
                  <div className="bg-white rounded-lg p-4 border border-primary-200 mt-4 animate-fadeIn">
                    <p className="text-sm text-primary-700">
                      No problem — visit {institution}&apos;s website to open a brokerage account there instead. Most major institutions offer similar investing options.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* No Institution Set Up */}
        {noInstitution && (
          <div className="bg-accent-green-50 border-2 border-accent-green-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="bg-accent-green-100 p-2 rounded-lg">
                <ArrowRight className="w-6 h-6 text-accent-green-700" />
              </div>
              <div>
                <h4 className="font-bold text-accent-green-900 text-lg mb-2">
                  Let's Get Started with Fidelity
                </h4>
                <p className="text-primary-700 leading-relaxed mb-3">
                  It looks like you haven't set up a brokerage account yet. No problem - we'll walk you through how to open one with Fidelity.
                </p>
                <p className="text-primary-700 leading-relaxed">
                  Click "Continue" below to learn how to set up your Fidelity brokerage account step-by-step.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
          <p className="text-sm text-primary-700">
            <strong>Note:</strong> A brokerage account is where you'll actually buy and hold your investments (stocks, bonds, index funds, etc.). It's different from a regular bank account.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation
        onBack={() => transitionTo(prevStep)}
        onNext={() => transitionTo(nextStep)}
        nextLabel={hasFidelityMoneyMarket ? "Continue to Investing Steps →" : "Continue to Setup Guide →"}
        isExiting={isExiting}
      />
    </StepContainer>
  )
}

export default BrokerageAccountCheck