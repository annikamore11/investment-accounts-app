import React from 'react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import useStepTransition from '@/hooks/useStepTransition'
import { CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'

const BrokerageAccountCheck = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const { isExiting, transitionTo } = useStepTransition()
  
  const emergencyFundInstitution = journeyData.emergencyFundInstitution
  const existingEmergencyFundInstitution = journeyData.existingEmergencyFundInstitution
  const emergencyFundAccountType = journeyData.emergencyFundAccountType
  const existingEmergencyFundType = journeyData.existingEmergencyFundType

  const handleNext = () => {
    transitionTo(nextStep)
  }

  const handleBack = () => {
    transitionTo(prevStep)
  }

  // Determine which institution they're using (prioritize current setup over existing)
  const institution = emergencyFundInstitution || existingEmergencyFundInstitution
  const accountType = emergencyFundAccountType || existingEmergencyFundType

  // Check if they have Fidelity with Money Market
  const hasFidelityMoneyMarket = 
    (institution?.toLowerCase().includes('fidelity') || institution === 'fidelity') && 
    accountType?.toLowerCase().includes('money-market')
  

  // Check if they have a different institution
  const hasDifferentInstitution = 
    institution && 
    !institution.toLowerCase().includes('fidelity') && 
    institution !== 'fidelity'

  // No institution set up
  const noInstitution = !institution

  return (
    <StepContainer
      title="Your Brokerage Account"
      subtitle="Let's see what you've already set up"
      isExiting={isExiting}
    >
      <div className="space-y-6">
        {/* Status Display */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Based on your previous responses:</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="font-medium">Institution:</span>
              <span>{institution || 'Not set up yet'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Account Type:</span>
              <span>{accountType || 'Not specified'}</span>
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
                <p className="text-gray-700 leading-relaxed mb-3">
                  We noticed from your past responses that it looks like you've already set up a Brokerage Account through Fidelity with a Money Market account. This means you're ready to start investing!
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Click "Continue" below to learn the steps to invest in your chosen funds.
                </p>
              </div>
            </div>

            
          </div>
        )}

        {/* Different Institution */}
        {hasDifferentInstitution && (
          <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-primary-100 p-2 rounded-lg">
                <AlertCircle className="w-6 h-6 text-primary-700" />
              </div>
              <div>
                <h4 className="font-bold text-primary-900 text-lg mb-2">
                  You're Using {institution}
                </h4>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We noticed you've set up your emergency fund with <strong>{institution}</strong>. You have two options for investing:
                </p>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 border border-primary-200">
                    <h5 className="font-semibold text-gray-900 mb-1">Option 1: Stay with {institution}</h5>
                    <p className="text-sm text-gray-700">
                      Visit your institution's website to learn how to invest in a brokerage account with them. Most major institutions offer similar investment options.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-primary-200">
                    <h5 className="font-semibold text-gray-900 mb-1">Option 2: Open a Fidelity Account</h5>
                    <p className="text-sm text-gray-700">
                      You can also open a separate brokerage account with Fidelity specifically for investing. Click "Continue" to learn how to set this up.
                    </p>
                  </div>
                </div>
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
                <p className="text-gray-700 leading-relaxed mb-3">
                  It looks like you haven't set up a brokerage account yet. No problem - we'll walk you through how to open one with Fidelity.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Click "Continue" below to learn how to set up your Fidelity brokerage account step-by-step.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> A brokerage account is where you'll actually buy and hold your investments (stocks, bonds, index funds, etc.). It's different from a regular bank account.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation
        onBack={handleBack}
        onNext={handleNext}
        canGoNext={true}
        nextLabel={hasFidelityMoneyMarket ? "Continue to Investing Steps →" : "Continue to Setup Guide →"}
        isExiting={isExiting}
      />
    </StepContainer>
  )
}

export default BrokerageAccountCheck