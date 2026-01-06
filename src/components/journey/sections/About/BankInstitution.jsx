'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, CheckCircle2, AlertCircle, Building2, Loader2, Clock, Zap } from 'lucide-react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import InfoBox from '@/components/ui/InfoBox'
import useStepTransition from '@/hooks/useStepTransition'

const BankInstitution = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [searchQuery, setSearchQuery] = useState(journeyData.bankInstitutionName || '')
  const [selectedInstitution, setSelectedInstitution] = useState(journeyData.bankInstitution || null)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState(null)
  const [verificationStatus, setVerificationStatus] = useState(null)
  const { isExiting, transitionTo } = useStepTransition()

  // Debounced search function
  const searchInstitutions = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    setError(null)

    try {
      const response = await fetch(`/api/institutions/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (data.success) {
        setSearchResults(data.institutions || [])
      } else {
        setError(data.message || 'Failed to search institutions')
        setSearchResults([])
      }
    } catch (err) {
      setError('Failed to connect to institution database')
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery && searchQuery.length >= 2) {
        searchInstitutions(searchQuery)
      } else {
        setSearchResults([])
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery, searchInstitutions])

  const handleSelectInstitution = async (institution) => {
    setSelectedInstitution(institution)
    setSearchQuery(institution.name)
    setSearchResults([])
    setIsVerifying(true)
    setVerificationStatus(null)

    try {
      const response = await fetch(`/api/institutions/check?name=${encodeURIComponent(institution.name)}`)
      const data = await response.json()

      if (data.success) {
        setVerificationStatus({
          supported: data.supported,
          institution: data.institution,
          instantVerification: data.instantVerification,
          verificationMethod: data.verificationMethod,
          suggestions: data.suggestions || []
        })
      }
    } catch (err) {
      setError('Failed to verify institution')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleNext = () => {
    updateJourneyData('bankInstitution', selectedInstitution)
    updateJourneyData('bankInstitutionName', searchQuery)
    updateJourneyData('bankVerificationMethod', verificationStatus?.verificationMethod || 'unknown')
    transitionTo(nextStep)
  }

  return (
    <StepContainer
      title="Bank Institution"
      isExiting={isExiting}
      exitDirection="horizontal"
    >
      <p className="text-lg sm:text-xl text-primary-700 max-w-4xl mx-auto mb-6 text-center">
        Which bank do you use?
      </p>

      <InfoBox
        type="why"
        message="We'll check if your bank supports instant verification or requires manual verification when connecting to investment platforms."
      />

      {/* Search Input */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-primary-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setSelectedInstitution(null)
              setVerificationStatus(null)
            }}
            placeholder="Search for your bank (e.g., Chase, Bank of America)"
            className="w-full pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-primary-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
            autoFocus
          />
          {isSearching && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <Loader2 className="h-5 w-5 text-primary-400 animate-spin" />
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && !selectedInstitution && (
          <div className="mt-2 bg-white border-2 border-primary-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
            {searchResults.map((institution) => (
              <button
                key={institution.id}
                onClick={() => handleSelectInstitution(institution)}
                className="w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors border-b border-primary-100 last:border-b-0 flex items-center space-x-3"
              >
                <Building2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-primary-900">{institution.name}</div>
                  {institution.urlHomeApp && (
                    <div className="text-sm text-primary-500 truncate">{institution.urlHomeApp}</div>
                  )}
                </div>
                {institution.oauthEnabled && (
                  <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    <Zap className="w-3 h-3 mr-1" />
                    Instant
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && !selectedInstitution && (
          <div className="mt-2 p-4 bg-orange-50 border-2 border-orange-200 rounded-xl">
            <p className="text-sm text-orange-800">
              No institutions found. Try a different search term or check the spelling.
            </p>
          </div>
        )}
      </div>

      {/* Verification Status */}
      {isVerifying && (
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-primary-50 border-2 border-primary-200 rounded-xl animate-fadeIn">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-5 h-5 text-primary-600 animate-spin flex-shrink-0" />
            <p className="text-sm text-primary-700">Checking verification method...</p>
          </div>
        </div>
      )}

      {verificationStatus && !isVerifying && selectedInstitution && (
        <div className="max-w-2xl mx-auto mb-6 animate-fadeIn">
          {verificationStatus.instantVerification ? (
            // Instant OAuth Verification
            <div className="p-4 sm:p-5 bg-green-50 border-2 border-green-300 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-1 flex items-center">
                    Instant Verification Available!
                  </h3>
                  <p className="text-sm text-green-800 mb-2">
                    {selectedInstitution.name} supports instant login through their secure portal. 
                    You'll connect in seconds.
                  </p>
                  <div className="text-xs text-green-700 bg-green-100 rounded-lg p-2 mt-2">
                    <strong>How it works:</strong> You'll log in directly through your bank's website. 
                    We never see your password—everything is secure and instant.
                  </div>
                </div>
              </div>
            </div>
          ) : verificationStatus.supported ? (
            // Micro-deposit Verification Required
            <div className="p-4 sm:p-5 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 mb-1">
                    Manual Verification Required (2-3 Days)
                  </h3>
                  <p className="text-sm text-yellow-800 mb-2">
                    {selectedInstitution.name} requires verification through micro-deposits.
                  </p>
                  <div className="text-xs text-yellow-700 bg-yellow-100 rounded-lg p-3 mt-2 space-y-2">
                    <p><strong>How it works:</strong></p>
                    <ol className="list-decimal ml-4 space-y-1">
                      <li>Fidelity sends 2 small deposits (like $0.17 and $0.32) to your account</li>
                      <li>Wait 1-3 business days for them to appear</li>
                      <li>Verify the exact amounts to complete connection</li>
                    </ol>
                    <p className="text-yellow-600 font-medium mt-2">
                      💡 This is still secure—just takes a bit longer!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Not Supported - Manual Entry Only
            <div className="p-4 sm:p-5 bg-orange-50 border-2 border-orange-300 rounded-xl">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900 mb-1">Limited Support</h3>
                  <p className="text-sm text-orange-800 mb-3">
                    This institution may require manual account information entry.
                  </p>
                  {verificationStatus.suggestions && verificationStatus.suggestions.length > 0 && (
                    <>
                      <p className="text-sm text-orange-800 font-medium mb-2">
                        Did you mean one of these?
                      </p>
                      <ul className="text-sm text-orange-800 space-y-1 ml-4 list-disc">
                        {verificationStatus.suggestions.slice(0, 3).map((suggestion) => (
                          <li key={suggestion.id}>
                            <button
                              onClick={() => handleSelectInstitution(suggestion)}
                              className="underline hover:text-orange-900 flex items-center"
                            >
                              {suggestion.name}
                              {suggestion.oauthEnabled && (
                                <span className="ml-2 text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                  Instant
                                </span>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto mb-6 p-4 sm:p-5 bg-red-50 border-2 border-red-200 rounded-xl animate-fadeIn">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 sm:w-6 h-5 sm:h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-1">Connection Error</h3>
              <p className="text-sm text-red-800 mb-2">{error}</p>
              {(error.includes('credentials') || error.includes('API returned an error')) && (
                <div className="text-sm text-red-800 mt-3 bg-red-100 p-3 rounded">
                  <p className="font-medium mb-2">Need to set up API credentials?</p>
                  <ol className="list-decimal ml-4 space-y-1">
                    <li>Get free credentials from <a href="https://developer.mastercard.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-900">Mastercard Developer Portal</a></li>
                    <li>Add them to your <code className="bg-red-200 px-1 rounded">.env.local</code> file</li>
                    <li>Restart your dev server</li>
                  </ol>
                  <p className="mt-2 text-xs">See <code className="bg-red-200 px-1 rounded">README_CREDENTIALS.md</code> for detailed instructions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <StepNavigation
        onBack={prevStep}
        onNext={handleNext}
        canGoNext={!!selectedInstitution}
        isExiting={isExiting}
      />

      {!selectedInstitution && searchQuery.length < 2 && (
        <p className="text-sm text-primary-500 text-center mt-4 animate-fadeIn">
          Start typing to search for your bank
        </p>
      )}
    </StepContainer>
  )
}

export default BankInstitution
