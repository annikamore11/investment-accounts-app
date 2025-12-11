import React, { useState } from 'react'
import { ExternalLink, ChevronLeft, ChevronRight, X, Info, AlertTriangle } from 'lucide-react'

const FidelitySetupGuide = ({ journeyData, nextStep, prevStep }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const emergencyFundCurrentAmount = journeyData.emergencyFundCurrentAmount || 0
  const bankType = journeyData.bankType || 'unknown'
  const hasBankAccount = journeyData.hasBankAccount

  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const [showBankNotice, setShowBankNotice] = useState(true)
  const [showNoBankWarning, setShowNoBankWarning] = useState(true)

  // Bank-specific instructions (same as before)
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
      notes: [
        'Your bank supports instant verification through Plaid',
        'The connection is secure and encrypted',
        'You won\'t need to enter routing or account numbers manually'
      ]
    }

    const regionalBanks = {
      instructions: [
        'Log in to Fidelity',
        'Go to "Accounts & Trade" → "Transfers"',
        'Click "Link a Bank Account"',
        'Try searching for your bank first',
        'If not found, select "Manual Entry"',
        'Enter your routing number (9 digits) and account number',
        'Fidelity will send 2 small deposits to verify (1-2 business days)',
        'Return to confirm the deposit amounts'
      ],
      notes: [
        'Find routing/account numbers on a check or in your bank\'s app',
        'The two small deposits are usually under $1 each',
        'Once verified, you can use this account for unlimited transfers'
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
      notes: [
        'Most online banks verify instantly',
        'Have your bank login credentials ready',
        'Manual verification takes 1-2 business days if needed'
      ]
    }

    const unknown = {
      instructions: [
        'Log in to Fidelity',
        'Go to "Accounts & Trade" → "Transfers"',
        'Click "Link a Bank Account"',
        'Search for your bank by name',
        'If found, log in with your online banking credentials',
        'If not found, select "Manual Entry"',
        'Enter routing and account numbers for verification'
      ],
      notes: [
        'Try searching first - many banks support instant verification',
        'Manual verification takes 1-2 business days',
        'You only need to do this once'
      ]
    }

    switch(bankType) {
      case 'large':
        return majorBanks
      case 'regional':
        return regionalBanks
      case 'online':
        return onlineBanks
      default:
        return unknown
    }
  }

  const bankLinkStep = getBankLinkInstructions()

  // Build steps based on whether they have a bank account
  const buildSteps = () => {
    const baseSteps = [
      {
        id: 'step1',
        title: 'What You\'ll Need',
        instructions: [
          'Social Security Number (for identity verification)',
          'Government-issued ID (driver\'s license or passport)',
          ...(hasBankAccount !== false ? [
            bankType === 'large' 
              ? 'Your online banking login (for instant verification)'
              : bankType === 'regional'
                ? 'Bank routing and account numbers (likely needed)'
                : 'Bank login OR routing/account numbers'
          ] : []),
          'Current address and contact info',
          'Employment details (employer name and address)',
          'Email and phone number'
        ],
        notes: 
          bankType === 'regional'
            ? [
                'Account opening may take a bit longer with smaller regional banks',
                'You\'ll get approval in a couple business days in most cases',
                'Have all documents ready before starting',
                'We will never ask you for bank details or personal identification (This is handled by your bank and Fidelity)'
              ]
            : [
                'Account opening takes about 10 minutes',
                'You\'ll get instant approval in most cases',
                'Have all documents ready before starting',
                'We will never ask you for bank details or personal identification (This is handled by your bank and Fidelity)'
              ],
        url: null
      },
      {
        id: 'step2',
        title: 'Open a Fidelity Account',
        instructions: [
          'Go to Fidelity.com and click "Open an Account"',
          'Select "Brokerage Account"',
          'Fill in your personal information',
          'When asked about "Core Position", select "Fidelity Government Money Market Fund (SPAXX)"',
          'Review and submit your application'
        ],
        notes: [
          'SPAXX as your core position means your cash automatically earns interest',
          'This is where your emergency fund will sit and grow',
          'There are no fees or minimums for this account'
        ],
        url: 'https://www.fidelity.com/open-account/overview'
      }
    ]

    // Add bank linking step only if they have a bank account
    if (hasBankAccount !== false) {
      baseSteps.push({
        id: 'step3',
        title: 'Link Your Bank',
        instructions: bankLinkStep.instructions,
        notes: bankLinkStep.notes,
        url: null
      })
    }

    // Transfer money step - different based on bank account status
    if (hasBankAccount === false) {
      baseSteps.push({
        id: 'step4',
        title: 'Funding Options Without a Bank Account',
        instructions: [],
        alternatives: [
          {
            title: 'Direct Deposit from Paycheck',
            description: 'Have part of your paycheck sent directly to Fidelity',
            steps: [
              'Get your Fidelity account and routing numbers',
              'Give these to your employer\'s HR/payroll department',
              'Choose what percentage or dollar amount to deposit'
            ],
            url: 'https://digital.fidelity.com/ftgw/digital/deposit/select/Z30695724?pageIdentifier=customerservice',
            limitations: 'You\'ll still need a way to withdraw money when needed'
          },
          {
            title: 'Mobile Check Deposit',
            description: 'Deposit checks using your phone camera',
            steps: [
              'Download the Fidelity mobile app',
              'Navigate to "Deposit Checks"',
              'Take photos of the front and back of your check',
              'Funds typically available in 1-2 business days'
            ],
            url: 'https://www.fidelity.com/mobile/mobile-check-deposit',
            limitations: 'Limited to checks - you\'ll need a bank account to withdraw cash'
          },
          {
            title: 'Third-Party Transfer',
            description: 'Transfer from services like PayPal, Venmo, or Cash App',
            steps: [
              'Link Fidelity to your third-party payment app',
              'Initiate transfer from the payment app',
              'May take 3-5 business days'
            ],
            url: 'https://www.fidelity.com/spend-save/mobile-payments',
            limitations: 'Higher fees and slower transfers than direct bank linking'
          }
        ],
        notes: [
          'These options work, but are less convenient than having a bank account',
          'You\'ll face challenges withdrawing money for emergencies without a linked bank',
          'We strongly recommend opening a bank account as your first financial step'
        ],
        url: null
      })
    } else {
      baseSteps.push({
        id: 'step4',
        title: 'Transfer Money',
        instructions: [
          ...(bankType === 'regional'
            ? [
                'Wait for bank verification if using manual entry (1-2 days)',
                'Once your bank is linked, go to "Transfers" in the top left corner'
              ]
            : [
                'Once your bank is linked, go to "Transfers" in the top left corner'
              ]),
          'Select "EFT to or from a bank"',
          'Select your bank in the "From" box',
          'Select "Individual" in the "To" box',
          'Choose "One-time transfer" for now',
          `Enter amount: $${emergencyFundCurrentAmount.toLocaleString()}`,
          'Submit (money arrives in 1-3 business days)'
        ],
        notes: [
          'Transfers are free and unlimited',
          'Start with whatever amount you have - you can always add more later',
          'Your money will automatically go into SPAXX and start earning interest'
        ],
        url: null
      })
    }

    return baseSteps
  }

  const steps = buildSteps()
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

  const getStepLabels = () => {
    if (hasBankAccount === false) {
      return ['Prepare', 'Open Account', 'Fund Account']
    }
    return ['Prepare', 'Open Account', 'Link Bank', 'Transfer']
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-100 mb-3">
          Fidelity Setup Guide
        </h1>
        <p className="text-base md:text-lg text-primary-200 max-w-4xl mx-auto">
          {hasBankAccount === false ? '3' : '4'} simple steps to get your emergency fund earning interest
        </p>
      </div>

      <div className="bg-primary-100 rounded-xl shadow-xl p-4 md:p-8 lg:p-12">
        {showDisclaimer && (
          <div className="bg-yellow-50 border-2 border-yellow-600 rounded-xl p-4 mb-6 relative">
            <button
              onClick={() => setShowDisclaimer(false)}
              className="absolute top-2 right-2 p-1 hover:bg-yellow-100 rounded transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4 text-yellow-700" />
            </button>
            <p className="text-sm text-yellow-900 pr-8">
              <strong>Disclaimer:</strong> This is educational information only, not financial advice. 
              We are not affiliated with Fidelity and receive no compensation. 
              Please research multiple options and consider consulting a financial advisor before making decisions.
            </p>
          </div>
        )}

        {/* No Bank Account Warning */}
        {hasBankAccount === false && showNoBankWarning && (
          <div className="bg-orange-50 border-2 border-orange-400 rounded-xl p-4 mb-6 relative">
            <button
              onClick={() => setShowNoBankWarning(false)}
              className="absolute top-2 right-2 p-1 hover:bg-orange-100 rounded transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4 text-orange-700" />
            </button>
            <div className="flex items-start space-x-3 pr-8">
              <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-orange-900 font-semibold mb-2">
                  You indicated you don't have a bank account
                </p>
                <p className="text-sm text-orange-800 mb-2">
                  While you can still open a Fidelity account, not having a bank account will make it harder to:
                </p>
                <ul className="text-sm text-orange-800 space-y-1 ml-4 list-disc mb-2">
                  <li>Move money in and out of your investment account</li>
                  <li>Access your emergency fund when you need it</li>
                  <li>Manage day-to-day expenses</li>
                </ul>
                <p className="text-sm text-orange-900 font-semibold">
                  We strongly recommend opening a basic checking or savings account first. It's the foundation of your financial journey.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bank Type Notice */}
        {bankType !== 'unknown' && showBankNotice && hasBankAccount !== false && (
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 mb-6 relative">
            <button
              onClick={() => setShowBankNotice(false)}
              className="absolute top-2 right-2 p-1 hover:bg-blue-100 rounded transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4 text-blue-700" />
            </button>
            <p className="text-sm text-blue-900 pr-8">
              {bankType === 'large' && (
                <><strong>Good news!</strong> Your bank supports instant verification - this will be quick!</>
              )}
              {bankType === 'regional' && (
                <><strong>Heads up:</strong> Your bank may require manual verification, which takes 1-2 extra days.</>
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
              const isPast = index < currentStepIndex
              
              const labels = getStepLabels()
              
              return (
                <div key={step.id} className="flex-1 relative">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setCurrentStepIndex(index)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all relative z-10 ${
                        isActive
                          ? 'bg-accent-green-600 text-white ring-4 ring-green-200'
                          : isPast
                            ? 'bg-green-400 text-white'
                            : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {index + 1}
                    </button>
                    
                    <span className={`text-xs mt-2 text-center font-medium hidden md:block ${
                      isActive ? 'text-gray-900' : 'text-gray-600'
                    }`}>
                      {labels[index]}
                    </span>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="absolute top-5 left-1/2 w-full h-0.5 -z-0">
                      <div className={`h-full ${
                        isPast ? 'bg-green-400' : 'bg-gray-300'
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
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{currentStep.title}</h2>

          {/* Regular Instructions */}
          {currentStep.instructions && currentStep.instructions.length > 0 && (
            <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-6 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                {currentStepIndex === 0 ? 'What to gather:' : 'Instructions:'}
              </h3>
              <ol className="space-y-2">
                {currentStep.instructions.map((instruction, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-sm font-semibold">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 text-sm md:text-base">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Alternative Methods (for no bank account) */}
          {currentStep.alternatives && (
            <div className="space-y-4 mb-4">
              {currentStep.alternatives.map((alt, index) => (
                <div key={index} className="bg-white border-2 border-gray-300 rounded-lg p-4 md:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-lg">{alt.title}</h3>
                    {alt.url && (
                      <a
                        href={alt.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-700 font-semibold"
                      >
                        <span>Learn More</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{alt.description}</p>
                  <ol className="space-y-2 mb-3">
                    {alt.steps.map((stepText, i) => (
                      <li key={i} className="flex items-start space-x-2 text-sm text-gray-700">
                        <span className="flex-shrink-0 w-5 h-5 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-xs font-semibold">
                          {i + 1}
                        </span>
                        <span>{stepText}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="bg-orange-50 border border-orange-300 rounded-lg p-3">
                    <p className="text-xs text-orange-900">
                      <strong>Important:</strong> {alt.limitations}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Helpful Notes */}
          {currentStep.notes && currentStep.notes.length > 0 && (
            <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">
                    {hasBankAccount === false && currentStep.alternatives ? 'Important to Know:' : 'Helpful Notes:'}
                  </h4>
                  <ul className="space-y-1">
                    {currentStep.notes.map((note, i) => (
                      <li key={i} className="text-sm text-blue-800">
                        • {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          {currentStep.url && !currentStep.alternatives && (
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
            <span className="hidden md:inline">Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStepIndex
                    ? 'bg-green-600'
                    : index < currentStepIndex
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
            <span className="hidden md:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

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
            Continue to Next Section →
          </button>
        </div>
      </div>
    </div>
  )
}

export default FidelitySetupGuide