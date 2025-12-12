import React, { useState } from 'react'
import { TrendingUp, Shield, CheckCircle, Edit2, DollarSign, Target, Building2, Landmark, Info } from 'lucide-react'

const EmergencyFundSummary = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [isExiting, setIsExiting] = useState(false)
  const hasEmergencyFund = journeyData.hasEmergencyFund
  const emergencyFundGoal = journeyData.emergencyFundGoal || 0
  const emergencyFundCurrentAmount = journeyData.emergencyFundCurrentAmount || 0
  const accountType = journeyData.emergencyFundAccountType || 'money-market'
  const financialInst = journeyData.emergencyFundInstitution || 
    (accountType === 'high-yield-savings' || accountType === 'bank' || accountType === 'other' 
      ? '' 
      : 'Fidelity Investments')
  
  const [isEditingAmount, setIsEditingAmount] = useState(false)
  const [editAmount, setEditAmount] = useState(emergencyFundCurrentAmount)
  const [isEditingAccountType, setIsEditingAccountType] = useState(false)
  const [isEditingInstitution, setIsEditingInstitution] = useState(false)
  const [customInstitution, setCustomInstitution] = useState(financialInst)

  // For users who already have emergency fund
  const [showExistingFundDetails, setShowExistingFundDetails] = useState(false)
  const [existingFundInst, setExistingFundInst] = useState(journeyData.existingEmergencyFundInstitution || '')
  const [existingFundType, setExistingFundType] = useState(journeyData.existingEmergencyFundType || '')
  const [existingFundAmount, setExistingFundAmount] = useState(journeyData.existingEmergencyFundAmount || '')

  // Calculate progress percentage
  const progressPercentage = emergencyFundGoal > 0 ? Math.min((emergencyFundCurrentAmount / emergencyFundGoal) * 100, 100) : 0

  const handleSaveAmount = () => {
    updateJourneyData('emergencyFundCurrentAmount', parseFloat(editAmount) || 0)
    setIsEditingAmount(false)
  }

  const handleSaveInstitution = () => {
    updateJourneyData('emergencyFundInstitution', customInstitution)
    setIsEditingInstitution(false)
  }

  const handleSaveExistingFund = () => {
    updateJourneyData('existingEmergencyFundInstitution', existingFundInst)
    updateJourneyData('existingEmergencyFundType', existingFundType)
    updateJourneyData('existingEmergencyFundAmount', parseFloat(existingFundAmount) || 0)
    setShowExistingFundDetails(false)
  }

  const handleNext = () => {
    setIsExiting(true)
    setTimeout(() => {
      nextStep()
    }, 500)
  }

  // Format account type for display
  const getAccountTypeLabel = (type) => {
    const labels = {
      'money-market': 'Money Market Fund (SPAXX)',
      'money-market-other': 'Money Market Fund (Other)',
      'high-yield-savings': 'High-Yield Savings Account',
      'bank': 'Traditional Bank Account',
      'other': 'Other'
    }
    return labels[type] || type
  }

  return (
    <div className={`w-full max-w-4xl mx-auto transition-all duration-500 ${
      isExiting ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
    }`}>
      <div className="bg-white rounded-xl shadow-xl p-4 md:p-8 lg:p-12 border-2 border-gray-200">
        
        {hasEmergencyFund ? (
          // Already has emergency fund
          <>
            {/* Report Header */}
            <div className="border-b-2 border-gray-300 pb-4 mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Emergency Fund Status</h2>
              <p className="text-sm text-gray-600 mt-1">You're already prepared!</p>
            </div>

            {/* Success Message */}
            <div className="bg-green-50 border-2 border-green-600 rounded-xl p-4 md:p-6 mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                <h3 className="text-lg md:text-xl font-bold text-green-900">Excellent Work!</h3>
              </div>
              <p className="text-sm md:text-base text-green-800">
                You already have an emergency fund set up. That's a huge accomplishment and puts you ahead of most people.
              </p>
            </div>

            {/* Quick Check Note */}
            <div className="bg-accent-purple-50 border-l-4 border-accent-purple-500 p-3 md:p-4 mb-6">
              <p className="text-sm text-gray-800">
                <strong className="text-accent-purple-900">Quick Check:</strong> Make sure your emergency fund is earning interest! If it's sitting in a regular checking/savings account earning 0%, consider moving it to a money market fund like SPAXX to earn ~5% annually.
              </p>
            </div>

            {/* Save Existing Fund Details */}
            <div className="bg-blue-50 border border-blue-300 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-2 mb-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">
                  <strong>Optional:</strong> Save your emergency fund details for organization and to keep all your financial info in one place on your dashboard.
                </p>
              </div>
              
              {!showExistingFundDetails ? (
                <button
                  onClick={() => setShowExistingFundDetails(true)}
                  className="text-sm font-semibold text-blue-700 hover:text-blue-900 underline"
                >
                  + Add Your Emergency Fund Details
                </button>
              ) : (
                <div className="space-y-4 mt-4">
                  {/* Financial Institution */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Where do you keep it?
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Chase Bank, Ally, Fidelity"
                      value={existingFundInst}
                      onChange={(e) => setExistingFundInst(e.target.value)}
                      className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Account Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Account Type
                    </label>
                    <select
                      value={existingFundType}
                      onChange={(e) => setExistingFundType(e.target.value)}
                      className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select account type</option>
                      <option value="money-market">Money Market Fund</option>
                      <option value="high-yield">High-Yield Savings</option>
                      <option value="traditional">Traditional Savings</option>
                      <option value="checking">Checking Account</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Amount Saved */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Amount Saved
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">$</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="10000"
                        value={existingFundAmount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '')
                          setExistingFundAmount(value)
                        }}
                        className="flex-1 p-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Save/Cancel Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveExistingFund}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Save Details
                    </button>
                    <button
                      onClick={() => setShowExistingFundDetails(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Show Saved Details if they exist */}
            {journeyData.existingEmergencyFundInstitution && (
              <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Your Saved Emergency Fund Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Institution:</span>
                    <span className="font-semibold text-gray-900">{journeyData.existingEmergencyFundInstitution}</span>
                  </div>
                  {journeyData.existingEmergencyFundType && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Type:</span>
                      <span className="font-semibold text-gray-900 capitalize">{journeyData.existingEmergencyFundType}</span>
                    </div>
                  )}
                  {journeyData.existingEmergencyFundAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold text-gray-900">${parseFloat(journeyData.existingEmergencyFundAmount).toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowExistingFundDetails(true)}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Edit Details
                </button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-4">
              <button onClick={prevStep} className="btn-journey-back" disabled={isExiting}>
                ← Back
              </button>
              <button onClick={handleNext} className="flex-1 btn-journey-next" disabled={isExiting}>
                Continue to Next Section →
              </button>
            </div>
          </>
        ) : (
          // Setting up emergency fund
          <>
            {/* Report Header */}
            <div className="border-b-2 border-gray-300 pb-4 mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Emergency Fund Summary</h2>
              <p className="text-sm text-gray-600 mt-1">Review your emergency fund plan below</p>
            </div>

            {/* Report Content - Table Style */}
            <div className="space-y-1 mb-8">
              
              {/* Financial Institution Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3 md:col-span-1 mb-2 md:mb-0">
                  <Building2 className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold text-gray-700">Financial Institution</span>
                </div>
                <div className="md:col-span-2">
                  {isEditingInstitution ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Enter institution name"
                        value={customInstitution}
                        onChange={(e) => setCustomInstitution(e.target.value)}
                        className="w-full p-2 border-2 border-accent-purple-300 rounded-lg focus:border-accent-purple-600 focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveInstitution}
                          className="px-3 py-1 bg-accent-green-600 text-white text-sm rounded hover:bg-accent-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setCustomInstitution(financialInst)
                            setIsEditingInstitution(false)
                          }}
                          className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 text-base md:text-lg font-semibold">
                        {financialInst}
                      </span>
                      <button
                        onClick={() => setIsEditingInstitution(true)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Change institution"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

             
              {/* Emergency Fund Holding Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3 md:col-span-1 mb-2 md:mb-0">
                  <Shield className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold text-gray-700">Account Type</span>
                </div>
                <div className="md:col-span-2">
                  {isEditingAccountType ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          updateJourneyData('emergencyFundAccountType', 'money-market')
                          setIsEditingAccountType(false)
                        }}
                        className="block w-full text-left px-3 py-2 rounded border-2 border-accent-green-600 bg-accent-green-50 hover:bg-accent-green-100"
                      >
                        <div className="font-semibold text-gray-900">Money Market Fund (SPAXX)</div>
                      </button>
                      <button
                        onClick={() => {
                          updateJourneyData('emergencyFundAccountType', 'money-market-other')
                          setIsEditingAccountType(false)
                        }}
                        className="block w-full text-left px-3 py-2 rounded border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      >
                        <div className="font-semibold text-gray-900">Money Market Fund (Other)</div>
                      </button>
                      <button
                        onClick={() => {
                          updateJourneyData('emergencyFundAccountType', 'high-yield')
                          setIsEditingAccountType(false)
                        }}
                        className="block w-full text-left px-3 py-2 rounded border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      >
                        <div className="font-semibold text-gray-900">High-Yield Savings Account</div>
                      </button>
                      <button
                        onClick={() => {
                          updateJourneyData('emergencyFundAccountType', 'traditional-bank')
                          setIsEditingAccountType(false)
                        }}
                        className="block w-full text-left px-3 py-2 rounded border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      >
                        <div className="font-semibold text-gray-900">Traditional Bank Account</div>
                      </button>
                      <button
                        onClick={() => {
                          updateJourneyData('emergencyFundAccountType', 'other')
                          setIsEditingAccountType(false)
                        }}
                        className="block w-full text-left px-3 py-2 rounded border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      >
                        <div className="font-semibold text-gray-900">Other</div>
                      </button>
                      <button
                        onClick={() => setIsEditingAccountType(false)}
                        className="text-sm text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="text-gray-900 text-base md:text-lg font-semibold">
                          {getAccountTypeLabel(accountType)}
                        </div>
                      </div>
                      <button
                        onClick={() => setIsEditingAccountType(true)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Change holding type"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Goal Amount Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3 md:col-span-1 mb-2 md:mb-0">
                  <Target className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold text-gray-700">Goal Amount</span>
                </div>
                <div className="md:col-span-2">
                  <div className="text-gray-900 text-base md:text-lg font-semibold">
                    ${emergencyFundGoal.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {(emergencyFundGoal / (journeyData.monthlyExpenses || 1)).toFixed(1)} months of expenses
                  </div>
                </div>
              </div>

              {/* Starting Amount Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3 md:col-span-1 mb-2 md:mb-0">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold text-gray-700">Starting Amount</span>
                </div>
                <div className="md:col-span-2">
                  {isEditingAmount ? (
                    <div className="flex items-center gap-2">
                      <span className="text-base md:text-lg font-bold">$</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={editAmount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '')
                          setEditAmount(value)
                        }}
                        className="w-32 text-base md:text-lg font-semibold p-1 border-2 border-accent-purple-300 rounded focus:border-accent-purple-600 focus:outline-none"
                      />
                      <button
                        onClick={handleSaveAmount}
                        className="px-3 py-1 bg-accent-green-600 text-white text-sm rounded hover:bg-accent-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditAmount(emergencyFundCurrentAmount)
                          setIsEditingAmount(false)
                        }}
                        className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 text-base md:text-lg font-semibold">
                        ${emergencyFundCurrentAmount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => setIsEditingAmount(true)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Edit amount"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  )}
                  {emergencyFundCurrentAmount === 0 && !isEditingAmount && (
                    <div className="text-sm text-gray-600 mt-1 italic">
                      Starting from scratch - that's okay!
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3 md:col-span-1 mb-2 md:mb-0">
                  <TrendingUp className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold text-gray-700">Progress</span>
                </div>
                <div className="md:col-span-2">
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">To Goal</span>
                      <span className="text-sm font-bold text-accent-green-700">
                        {progressPercentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-accent-green-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                  {emergencyFundCurrentAmount < emergencyFundGoal ? (
                    <div className="text-sm text-gray-600">
                      ${(emergencyFundGoal - emergencyFundCurrentAmount).toLocaleString()} remaining
                    </div>
                  ) : (
                    <div className="text-sm text-accent-green-700 font-semibold">
                      Goal reached!
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              <button
                onClick={prevStep}
                className="btn-journey-back"
                disabled={isExiting}
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                disabled={isExiting}
                className="flex-1 btn-journey-next"
              >
                Continue to Next Section →
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default EmergencyFundSummary