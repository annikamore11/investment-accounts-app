import React, { useState } from 'react'
import { TrendingUp, Shield, Check, ChevronDown, ChevronUp } from 'lucide-react'

const EmergencyFundOptions = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const hasEmergencyFund = journeyData.hasEmergencyFund
  const emergencyFundGoal = journeyData.emergencyFundGoal || 0
  const [selectedOption, setSelectedOption] = useState(journeyData.emergencyFundAccountType || '')
  
  // Expandable sections state
  const [expandedSection, setExpandedSection] = useState(null)
  
  // Calculate interest comparison
  const years = 5
  const bankValue = emergencyFundGoal
  const spaxxValue = emergencyFundGoal * Math.pow(1.05, years)
  const difference = spaxxValue - bankValue

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
      id: 'spaxx',
      title: 'Fidelity Money Market Funds (like SPAXX)',
      content: {
        what: 'A type of mutual fund that invests in very safe, short-term securities like US Treasury bills.',
        safety: 'Just as safe as a bank. Protected by SIPC insurance (similar to FDIC).',
        access: 'Can transfer to your bank account in 1-2 business days.',
        interest: 'Currently earning around 5% per year.',
        fees: 'No fees, no minimums, no penalties.'
      }
    },
    {
      id: 'bank',
      title: 'Regular Bank Accounts',
      content: {
        what: 'Traditional checking or savings account at your bank.',
        safety: 'Very safe. FDIC insured up to $250,000.',
        access: 'Instant access anytime.',
        interest: 'Usually 0% - 0.5% per year.',
        downside: 'Money loses value to inflation. Too easy to spend.'
      }
    },
    {
      id: 'other',
      title: 'Other Brokerages',
      content: {
        what: 'Money market funds at Vanguard, Schwab, E*TRADE, etc.',
        safety: 'Just as safe as Fidelity. SIPC protected.',
        access: '1-2 business days to transfer to bank.',
        interest: 'Similar rates around 4-5% per year.',
        note: 'All good options - we just know Fidelity best for beginners.'
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
          {hasEmergencyFund ? "Great job!" : "Choose the best option for you"}
        </p>
      </div>

      <div className="bg-primary-100 rounded-xl shadow-xl p-8 md:p-12">
        

        <div>
            {/* Goal Recap */}
            <div className="bg-gray-50 border border-primary-400 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">Your Goal</p>
                    <p className="text-3xl font-bold text-gray-900">
                    ${emergencyFundGoal.toLocaleString()}
                    </p>
                </div>
                <Shield className="w-10 h-10 text-gray-400" />
                </div>
            </div>

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
                        <span className="text-2xl">{section.emoji}</span>
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
                                <strong className="text-gray-900 capitalize">{key}:</strong> {value}
                            </p>
                            ))}
                        </div>
                        </div>
                    )}
                    </div>
                ))}
            </div>
        </div>

        {/* Comparison */}
        <div className="bg-gray-50 border border-primary-400 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Your ${emergencyFundGoal.toLocaleString()} After 5 Years:</h3>
            
            <div className="grid grid-cols-3 gap-3 text-center">
            <div>
                <p className="text-xs text-gray-600 mb-1">Bank (0% - 1%)</p>
                <p className="text-lg font-bold text-gray-900">
                ${bankValue.toLocaleString()}
                </p>
            </div>
            
            <div className="bg-green-50 border border-primary-400 rounded p-2">
                <p className="text-xs text-gray-600 mb-1">Money Market (3% - 5%)</p>
                <p className="text-lg font-bold text-green-700">
                ${spaxxValue.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </p>
            </div>

            <div>
                <p className="text-xs text-gray-600 mb-1">Difference</p>
                <p className="text-lg font-bold text-green-700">
                +${difference.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </p>
            </div>
            </div>
        </div>

        {/* Selection */}
        <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Where do you want to keep it?</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <button
                onClick={() => setSelectedOption('fidelity')}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedOption === 'fidelity'
                    ? 'border-accent-green-600 bg-accent-green-50 shadow-sm'
                    : 'border-primary-400 hover:border-primary-600 hover:bg-gray-100 bg-primary-50'
                }`}
            >
                <div className="flex items-center justify-between">
                <div>
                    <p className="font-bold text-gray-900">Fidelity (SPAXX)</p>
                    <p className="text-sm text-gray-600">We'll walk you through setup</p>
                </div>
                {selectedOption === 'fidelity' && (
                    <Check className="w-6 h-6 text-accent-green-600" />
                )}
                </div>
            </button>

            <button
                onClick={() => setSelectedOption('other-broker')}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedOption === 'other-broker'
                    ? 'border-accent-green-600 bg-accent-green-50 shadow-sm'
                    : 'border-primary-400 hover:border-primary-600 hover:bg-gray-100 bg-primary-50'
                }`}
            >
                <div className="flex items-center justify-between">
                <div>
                    <p className="font-bold text-gray-900">Other Brokerage</p>
                    <p className="text-sm text-gray-600">Vanguard, Schwab, etc.</p>
                </div>
                {selectedOption === 'other-broker' && (
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
                    <p className="font-bold text-gray-900">Regular Bank Account</p>
                    <p className="text-sm text-gray-600">Not recommended</p>
                </div>
                {selectedOption === 'bank' && (
                    <Check className="w-6 h-6 text-accent-green-600" />
                )}
                </div>
            </button>
            </div>
        </div>

        {/* Warning for bank selection */}
        {selectedOption === 'bank' && (
            <div className="bg-purple-50 border border-purple-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-purple-900 mb-2">
                <strong>Heads up:</strong> You'll miss out on ~${difference.toLocaleString(undefined, {maximumFractionDigits: 0})} over 5 years by keeping it in a low to no interest account.
            </p>
            <p className="text-sm text-purple-900 font-semibold">
                Consider a high-yield option instead.
            </p>
            </div>
        )}
        {/* Warning for other brokerage selection */}
        {selectedOption === 'other-broker' && (
            <div className="bg-purple-50 border border-purple-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-purple-900 mb-2">
                <strong>Heads up:</strong> We won't be able to walk you through setting up an account with a different brokerage at the moment. 
            </p>
            <p className="text-sm text-purple-900 font-semibold">
                If you would like step by step help, consider Fidelity or contact your brokerage of choice.
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
                {selectedOption === 'fidelity' ? 'Show Me How to Set Up →' : 'Continue →'}
                </button>
            </div>
        </div>
        
    </div>
</div>
  )
}

export default EmergencyFundOptions