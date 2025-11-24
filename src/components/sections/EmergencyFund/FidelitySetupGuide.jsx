import React, { useState } from 'react'
import { CheckCircle, Circle, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'

const FidelitySetupGuide = ({ journeyData, nextStep, prevStep }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
  })

  const emergencyFundGoal = journeyData.emergencyFundGoal || 0
  const bankType = journeyData.bankType || 'unknown' // 'major', 'regional', 'credit-union', 'online', 'unknown'
  console.log(bankType)

  const toggleComplete = (stepId) => {
    setCompletedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }))
  }

  const allStepsComplete = Object.values(completedSteps).every(v => v === true)

  // Bank-specific instructions
  const getBankLinkInstructions = () => {
    const majorBanks = {
      instructions: [
        'Log in to Fidelity',
        'Go to "Accounts & Trade" → "Transfers"',
        'Click "Link a Bank Account"',
        'Select your bank from the list (Chase, Bank of America, Wells Fargo, etc.)',
        'Log in with your online banking credentials',
        'Instant verification - you\'re done!'
      ],
      tips: [
        'Your bank supports instant verification',
        'Use the same login you use for online banking',
        'Connection is secure and encrypted'
      ]
    }

    const regionalBanks = {
      instructions: [
        'Log in to Fidelity',
        'Go to "Accounts & Trade" → "Transfers"',
        'Click "Link a Bank Account"',
        'Try searching for your bank first - it might be listed',
        'If not found, select "Manual Entry"',
        'Enter your routing number (9 digits) and account number',
        'Fidelity will send 2 small deposits to verify (1-2 business days)',
        'Return to confirm the deposit amounts'
      ],
      tips: [
        'Find routing/account numbers on a check or in your bank app',
        'Verification takes 1-2 days with manual entry',
        'Keep an eye on your bank account for the small deposits'
      ]
    }

    const creditUnions = {
      instructions: [
        'Log in to Fidelity',
        'Go to "Accounts & Trade" → "Transfers"',
        'Click "Link a Bank Account"',
        'Search for your credit union by name',
        'If found, log in with your online banking credentials',
        'If not found, select "Manual Entry" and enter routing/account numbers',
        'Manual entry requires 2 small deposit verification (1-2 days)'
      ],
      tips: [
        'Many credit unions support instant verification',
        'Have your routing/account numbers ready just in case',
        'Manual verification takes 1-2 business days'
      ]
    }

    const onlineBanks = {
      instructions: [
        'Log in to Fidelity',
        'Go to "Accounts & Trade" → "Transfers"',
        'Click "Link a Bank Account"',
        'Search for your bank (Ally, Marcus, Discover, etc.)',
        'Most online banks support instant login verification',
        'If not, use manual entry with routing/account numbers'
      ],
      tips: [
        'Online banks usually verify instantly',
        'Have login credentials ready',
        'Some may require manual entry'
      ]
    }

    const unknown = {
      instructions: [
        'Log in to Fidelity',
        'Go to "Accounts & Trade" → "Transfers"',
        'Click "Link a Bank Account"',
        'Search for your bank by name',
        'If found, log in with your online banking credentials (instant)',
        'If not found, select "Manual Entry"',
        'Enter routing and account numbers for manual verification (1-2 days)'
      ],
      tips: [
        'Try searching first - many banks support instant verification',
        'Have routing/account numbers ready as backup',
        'Manual verification takes 1-2 business days'
      ]
    }

    switch(bankType) {
      case 'large':
        return majorBanks
      case 'regional':
        return regionalBanks
      case 'business':
        return creditUnions
      case 'online':
        return onlineBanks
      default:
        return unknown
    }
  }

  const bankLinkStep = getBankLinkInstructions()

  const steps = [
    {
      id: 'step1',
      title: 'What You\'ll Need',
      instructions: [
        'Social Security Number (for identity verification)',
        'Government-issued ID (driver\'s license or passport)',
        bankType === 'large' 
          ? 'Your online banking login (for instant verification)'
          : bankType === 'regional' || bankType === 'credit-union'
            ? 'Bank routing and account numbers (likely needed)'
            : 'Bank login OR routing/account numbers',
        'Current address and contact info',
        'Employment details (employer name and address)',
        'Email and phone number'
      ],
      tips: [
        'Gather everything before you start',
        'Takes about 10 minutes once you have it all',
        bankType === 'large'
          ? 'Your bank supports instant verification - no routing numbers needed!'
          : 'Keep your bank info handy for step 3'
      ],
      url: null
    },
    {
      id: 'step2',
      title: 'Open a Fidelity Account',
      instructions: [
        'Go to Fidelity.com and click "Open an Account"',
        'Select "Brokerage Account" (Individual/Nonretirement)',
        'Fill in your info (name, address, SSN, employment)',
        'Choose "Cash" as core position',
        'Submit - instant approval'
      ],
      tips: [
        'Use legal name from ID',
        'Have SSN ready',
        'Free account, no minimums'
      ],
      url: 'https://www.fidelity.com/open-account/overview'
    },
    {
      id: 'step3',
      title: 'Link Your Bank',
      instructions: bankLinkStep.instructions,
      tips: bankLinkStep.tips,
      url: null
    },
    {
      id: 'step4',
      title: 'Transfer Money',
      instructions: [
        bankType === 'regional' || bankType === 'credit-union'
          ? 'Wait for bank verification if using manual entry (1-2 days)'
          : 'Once your bank is linked, go to "Accounts & Trade" → "Transfers"',
        'Select "Deposit" from linked bank',
        `Enter amount: $${emergencyFundGoal.toLocaleString()}`,
        'Choose "One-time transfer"',
        'Submit (arrives in 1-3 days)'
      ],
      tips: [
        'Start with what you have',
        'Transfers are free and unlimited',
        'Money sits in cash until next step',
        bankType === 'regional' || bankType === 'credit-union'
          ? 'Total wait time: 2-4 days for manual verification + transfer'
          : 'Usually arrives in 1-3 business days'
      ],
      url: null
    },
    {
      id: 'step5',
      title: 'Buy SPAXX',
      instructions: [
        'Once your transfer clears, go to "Accounts & Trade" → "Trade"',
        'Search "SPAXX" and select it',
        'Click "Buy"',
        'Enter your full cash balance amount',
        'Review and place order'
      ],
      tips: [
        'No fees, no minimums',
        'Sell anytime',
        'Interest paid monthly',
        'Not a stock - stable money market fund'
      ],
      url: null
    }
  ]

  const currentStep = steps[currentStepIndex]

  const goNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1)
    }
  }

  const goPrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          Fidelity Setup Guide
        </h1>
        <p className="text-lg text-primary-200 max-w-4xl mx-auto">
          5 simple steps to get your money earning 5%
        </p>
      </div>

      <div className="bg-primary-100 rounded-xl shadow-xl p-8 md:p-12">
        
        {/* Bank Type Notice */}
        {bankType !== 'unknown' && (
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-900">
              {bankType === 'large' && (
                <><strong>Good news!</strong> Your bank supports instant verification - this will be quick!</>
              )}
              {(bankType === 'regional') && (
                <><strong>Heads up:</strong> You indicated you use a regional bank or credit union. Your bank may require manual verification, which takes 1-2 extra days.</>
              )}
              {bankType === 'online' && (
                <><strong>Note:</strong> Most online banks support instant verification!</>
              )}
            </p>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex
              const isCompleted = completedSteps[step.id]
              const isPast = index < currentStepIndex
              
              // Step labels
              const labels = ['Prepare', 'Open Account', 'Link Bank', 'Transfer', 'Buy SPAXX']
              
              return (
                <div key={step.id} className="flex-1 relative">
                  <div className="flex flex-col items-center">
                    {/* Circle */}
                    <button
                      onClick={() => setCurrentStepIndex(index)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all relative z-10 ${
                        isCompleted
                          ? 'bg-green-600 text-white'
                          : isActive
                            ? 'bg-accent-green-600 text-white ring-4 ring-green-200'
                            : isPast
                              ? 'bg-gray-400 text-white'
                              : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </button>
                    
                    {/* Label */}
                    <span className={`text-xs mt-2 text-center font-medium ${
                      isActive ? 'text-gray-900' : 'text-gray-600'
                    }`}>
                      {labels[index]}
                    </span>
                  </div>
                  
                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-5 left-1/2 w-full h-0.5 -z-0">
                      <div className={`h-full ${
                        isPast || isCompleted ? 'bg-green-600' : 'bg-gray-300'
                      }`} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-6">
          {/* Step Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{currentStep.title}</h2>
            <button
              onClick={() => toggleComplete(currentStep.id)}
              className="flex-shrink-0"
            >
              {completedSteps[currentStep.id] ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <Circle className="w-8 h-8 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-white border border-gray-300 rounded-lg p-6 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              {currentStepIndex === 0 ? 'What to gather:' : 'Instructions:'}
            </h3>
            <ol className="space-y-2">
              {currentStep.instructions.map((instruction, i) => (
                <li key={i} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-sm font-semibold">
                    {currentStepIndex === 0 ? '•' : i + 1}
                  </span>
                  <span className="text-gray-700">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          {currentStep.tips && currentStep.tips.length > 0 && (
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">💡 Tips:</h4>
              <ul className="space-y-1">
                {currentStep.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Button */}
          {currentStep.url && (
            <a
              href={currentStep.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <span>Open Fidelity.com</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goPrevious}
            disabled={currentStepIndex === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentStepIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStepIndex
                    ? 'bg-green-600'
                    : completedSteps[step.id]
                      ? 'bg-green-400'
                      : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={currentStepIndex === steps.length - 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentStepIndex === steps.length - 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Completion Message */}
        {allStepsComplete && (
          <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-semibold">
              ✓ All steps complete! Your ${emergencyFundGoal.toLocaleString()} is now earning ~5% in SPAXX.
            </p>
          </div>
        )}

        {/* Help */}
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 mb-6">
          <p className="text-sm text-gray-700">
            <strong>Need help?</strong> Call Fidelity 24/7: 1-800-343-3548
          </p>
        </div>

        {/* Bottom Navigation */}
        <div className="flex gap-4">
          <button onClick={prevStep} className="btn-journey-back">
            ← Back
          </button>
          <button onClick={nextStep} className="flex-1 btn-journey-next">
            {allStepsComplete ? 'Continue to Retirement →' : 'Skip for Now →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FidelitySetupGuide