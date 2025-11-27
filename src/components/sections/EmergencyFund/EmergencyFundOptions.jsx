import React, { useState } from 'react'
import { TrendingUp, Shield, Check, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'

const EmergencyFundOptions = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const hasEmergencyFund = journeyData.hasEmergencyFund
  const emergencyFundGoal = journeyData.emergencyFundGoal || 0
  const [selectedOption, setSelectedOption] = useState(journeyData.emergencyFundAccountType || '')
  
  // Expandable sections state
  const [expandedSection, setExpandedSection] = useState(null)
  
  // Calculate interest comparison - using 5% as example rate
  const years = 5
  const exampleRate = 0.05
  const bankValue = emergencyFundGoal
  const moneyMarketValue = emergencyFundGoal * Math.pow(1 + exampleRate, years)
  const difference = moneyMarketValue - bankValue

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const handleNext = () => {
    updateJourneyData('emergencyFundAccountType', selectedOption)
    
    setTimeout(() => {
      nextStep()
    }, 50)
  }

  const educationSections = [
    {
      id: 'money-market',
      title: 'Money Market Funds',
      content: {
        what: 'Mutual funds that invest in very safe, short-term securities like US Treasury bills. Available at brokerages like Fidelity (SPAXX), Vanguard (VMFXX), Schwab (SWVXX), and others.',
        safety: 'Generally considered very safe. Protected by SIPC insurance at brokerages (similar to FDIC at banks).',
        access: 'Typically can transfer to your bank account in 1-2 business days.',
        interest: 'Interest rates vary. As of late 2024, many were earning 3-5% annually, but rates change frequently.',
        fees: 'Most major brokerages offer options with no fees and no minimums.',
        convenience: 'Keep your emergency fund, retirement accounts (IRA, Roth IRA), and other investments all in one place. Makes it easier to see your full financial picture and transfer money between accounts.'
      }
    },
    {
      id: 'high-yield-savings',
      title: 'High-Yield Savings Accounts',
      content: {
        what: 'Savings accounts at online banks that offer higher interest rates than traditional banks. Examples include Ally, Marcus, Discover, etc.',
        safety: 'Very safe. FDIC insured up to $250,000.',
        access: 'Usually instant or same-day access.',
        interest: 'Rates vary, typically 3-5% annually as of late 2024.',
        note: 'Good alternative to money market funds with similar rates. However, separate from your investment and retirement accounts.'
      }
    },
    {
      id: 'bank',
      title: 'Traditional Bank Accounts',
      content: {
        what: 'Regular checking or savings account at a traditional bank.',
        safety: 'Very safe. FDIC insured up to $250,000.',
        access: 'Instant access anytime.',
        interest: 'Usually 0% - 1% per year at most traditional banks.',
        considerations: 'Lower interest means money may lose value to inflation over time. However, offers maximum convenience and accessibility. Separate from investment accounts.'
      }
    }
  ]

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mt-10 mb-6 lg:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-100 mb-3">
          {hasEmergencyFund ? "You're All Set!" : "Where to Keep Your Emergency Fund"}
        </h1>
        <p className="text-lg text-primary-200 max-w-4xl mx-auto">
          {hasEmergencyFund ? "Great job!" : "Explore your options"}
        </p>
      </div>

      <div className="bg-primary-100 rounded-xl shadow-xl p-8 md:p-12">
        
        {/* Disclaimer */}
        <div className="bg-yellow-50 border-2 border-yellow-600 rounded-xl p-4 mb-6 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-900">
              <strong>Educational Information Only:</strong> This information is for educational purposes and is not financial advice. 
              Interest rates vary and are not guaranteed. We are not affiliated with any financial institutions mentioned. 
              Research multiple options and consider consulting a financial advisor before making decisions.
            </p>
          </div>
        </div>

        <div>

            {/* Education Dropdowns */}
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Learn About Your Options:</h3>
                <div className="space-y-3">
                {educationSections.map(section => (
                    <div key={section.id} className="border border-primary-400 rounded-lg overflow-hidden">
                    <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                    >
                        <div className="flex items-center space-x-3">
                        <span className="font-semibold text-gray-900">{section.title}</span>
                        </div>
                        {expandedSection === section.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                    </button>
                    
                    {expandedSection === section.id && (
                        <div className="p-4 bg-white border-t border-gray-200">
                        <div className="space-y-2 text-sm text-gray-700">
                            {Object.entries(section.content).map(([key, value]) => (
                            <p key={key}>
                                <strong className="text-gray-900 capitalize">{key.replace('-', ' ')}:</strong> {value}
                            </p>
                            ))}
                        </div>
                        </div>
                    )}
                    </div>
                ))}
            </div>
        </div>

       
        {/* Selection */}
        <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">What type of account interests you?</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <button
                onClick={() => setSelectedOption('money-market')}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedOption === 'money-market'
                    ? 'border-accent-green-600 bg-accent-green-50 shadow-sm'
                    : 'border-primary-400 hover:border-primary-600 hover:bg-gray-100 bg-primary-50'
                }`}
            >
                <div className="flex items-center justify-between mb-2">
                <div>
                    <p className="font-bold text-gray-900">Money Market Fund</p>
                    <p className="text-sm text-gray-600">We can show setup steps</p>
                </div>
                {selectedOption === 'money-market' && (
                    <Check className="w-6 h-6 text-accent-green-600" />
                )}
                </div>
            </button>

            <button
                onClick={() => setSelectedOption('high-yield-savings')}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedOption === 'high-yield-savings'
                    ? 'border-accent-green-600 bg-accent-green-50 shadow-sm'
                    : 'border-primary-400 hover:border-primary-600 hover:bg-gray-100 bg-primary-50'
                }`}
            >
                <div className="flex items-center justify-between">
                <div>
                    <p className="font-bold text-gray-900">High-Yield Savings</p>
                    <p className="text-sm text-gray-600">Online banks</p>
                </div>
                {selectedOption === 'high-yield-savings' && (
                    <Check className="w-6 h-6 text-accent-green-600" />
                )}
                </div>
            </button>

            <button
                onClick={() => setSelectedOption('bank')}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedOption === 'bank'
                    ? 'border-accent-green-600 bg-accent-green-50 shadow-sm'
                    : 'border-primary-400 hover:border-primary-600 hover:bg-gray-100 bg-primary-50'
                }`}
            >
                <div className="flex items-center justify-between">
                <div>
                    <p className="font-bold text-gray-900">Traditional Bank</p>
                    <p className="text-sm text-gray-600">Lower rates, max convenience</p>
                </div>
                {selectedOption === 'bank' && (
                    <Check className="w-6 h-6 text-accent-green-600" />
                )}
                </div>
            </button>
            </div>
        </div>

        {/* Info for money market selection */}
        {selectedOption === 'money-market' && (
            <div className="bg-blue-50 border border-blue-400 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900 mb-2">
                Money market funds at brokerages let you keep your emergency fund alongside your retirement accounts (IRA, Roth IRA) and other investments. 
            </p>
            <p className='text-sm text-blue-900'>
              <strong>Note:</strong> We know Fidelity best and can help you set up an account there using SPAXX money market fund!
            </p>
            </div>
        )}

        {/* Info for bank selection */}
        {selectedOption === 'bank' && (
            <div className="bg-blue-50 border border-blue-400 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900 mb-2">
                <strong>Note:</strong> Traditional bank accounts typically offer lower interest rates (0-1% annually). 
                Based on the example above, you might miss out on potential growth compared to higher-yield options.
            </p>
            <p className="text-sm text-blue-900">
                However, they offer maximum convenience and instant access. Consider exploring higher-yield options if growth is important to you.
            </p>
            </div>
        )}
        {/* Info for high-yield savings selection */}
        {selectedOption === 'high-yield-savings' && (
            <div className="bg-blue-50 border border-blue-400 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900 mb-2">
                High-yield savings accounts typically offer competitive rates while maintaining FDIC insurance and easy access.
            </p>
            <p className="text-sm text-blue-900">
                <strong>Note: </strong>We don't provide specific setup guidance for these accounts at this time.
            </p>
            </div>
        )}


            {/* Navigation */}
            <div className="flex gap-4">
                <button onClick={prevStep} className="btn-journey-back">
                ← Back
                </button>
                <button
                onClick={handleNext}
                disabled={!selectedOption}
                className={`flex-1 ${
                    selectedOption ? 'btn-journey-next' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                >
                {selectedOption === 'money-market' ? 'See Setup Guide →' : 'Continue →'}
                </button>
            </div>
        </div>
        
    </div>
</div>
  )
}

export default EmergencyFundOptions