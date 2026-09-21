'use client'

import { useState, useEffect } from 'react'
import { Search, AlertCircle, Building2, Loader2, Clock, Zap } from 'lucide-react'
import StepContainer from '@/components/ui/StepContainer'
import StepNavigation from '@/components/ui/StepNavigation'
import InfoBox from '@/components/ui/InfoBox'
import useStepTransition from '@/hooks/useStepTransition'

const SEARCH_DEBOUNCE_MS = 500
const MIN_QUERY_LENGTH = 2

const BankInstitution = ({ journeyData, updateJourneyData, nextStep, prevStep }) => {
  const [searchQuery, setSearchQuery] = useState(journeyData.bankInstitutionName || '')
  const [selectedInstitution, setSelectedInstitution] = useState(journeyData.bankInstitution || null)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)
  const { isExiting, transitionTo } = useStepTransition()

  const canSearch = searchQuery.trim().length >= MIN_QUERY_LENGTH

  // Debounced search; skipped once an institution is chosen
  useEffect(() => {
    if (!canSearch || selectedInstitution) {
      setSearchResults([])
      return
    }

    let cancelled = false
    const timer = setTimeout(async () => {
      setIsSearching(true)
      setError(null)
      try {
        const response = await fetch(`/api/institutions/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()
        if (cancelled) return
        if (data.success) {
          setSearchResults(data.institutions || [])
        } else {
          setError(data.message || 'Failed to search institutions')
          setSearchResults([])
        }
      } catch {
        if (!cancelled) {
          setError('Failed to connect to institution database')
          setSearchResults([])
        }
      } finally {
        if (!cancelled) setIsSearching(false)
      }
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [searchQuery, canSearch, selectedInstitution])

  const handleQueryChange = (e) => {
    setSearchQuery(e.target.value)
    setSelectedInstitution(null)
  }

  const handleSelectInstitution = (institution) => {
    setSelectedInstitution(institution)
    setSearchQuery(institution.name)
    setSearchResults([])
  }

  const handleNext = () => {
    updateJourneyData('bankInstitution', selectedInstitution)
    updateJourneyData('bankInstitutionName', searchQuery)
    updateJourneyData('bankVerificationMethod', selectedInstitution.oauthEnabled ? 'instant' : 'micro-deposits')
    transitionTo(nextStep)
  }

  return (
    <StepContainer title="Bank Institution" isExiting={isExiting}>
      <p className="text-lg sm:text-xl text-primary-700 max-w-4xl mx-auto mb-6 text-center">
        Which bank do you use?
      </p>

      <InfoBox
        type="why"
        message="We'll check if your bank supports instant verification or requires manual verification when connecting to investment platforms."
      />

      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-primary-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleQueryChange}
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

        {searchResults.length > 0 && !selectedInstitution && (
          <div className="mt-2 bg-white border-2 border-primary-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
            {searchResults.map((institution) => (
              <button
                key={institution.id}
                onClick={() => handleSelectInstitution(institution)}
                className="w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors border-b border-primary-100 last:border-b-0 flex items-center space-x-3"
              >
                <Building2 className="w-5 h-5 text-primary-500 shrink-0" />
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

        {canSearch && !isSearching && !error && searchResults.length === 0 && !selectedInstitution && (
          <div className="mt-2 p-4 bg-orange-50 border-2 border-orange-200 rounded-xl">
            <p className="text-sm text-orange-800">
              No institutions found. Try a different search term or check the spelling.
            </p>
          </div>
        )}
      </div>

      {selectedInstitution && (
        <div className="max-w-2xl mx-auto mb-6 animate-fadeIn">
          {selectedInstitution.oauthEnabled ? (
            <VerificationCard
              tone="green"
              icon={Zap}
              title="Instant Verification Available!"
              summary={`${selectedInstitution.name} supports instant login through their secure portal. You'll connect in seconds.`}
            >
              <strong>How it works:</strong> You&apos;ll log in directly through your bank&apos;s website. We never see
              your password—everything is secure and instant.
            </VerificationCard>
          ) : (
            <VerificationCard
              tone="yellow"
              icon={Clock}
              title="Manual Verification Required (2-3 Days)"
              summary={`${selectedInstitution.name} requires verification through micro-deposits.`}
            >
              <p><strong>How it works:</strong></p>
              <ol className="list-decimal ml-4 space-y-1">
                <li>Fidelity sends 2 small deposits (like $0.17 and $0.32) to your account</li>
                <li>Wait 1-3 business days for them to appear</li>
                <li>Verify the exact amounts to complete connection</li>
              </ol>
              <p className="font-medium mt-2">💡 This is still secure—just takes a bit longer!</p>
            </VerificationCard>
          )}
        </div>
      )}

      {error && (
        <div className="max-w-2xl mx-auto mb-6 p-4 sm:p-5 bg-red-50 border-2 border-red-200 rounded-xl animate-fadeIn">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 sm:w-6 h-5 sm:h-6 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Bank search is unavailable right now</h3>
              <p className="text-sm text-red-800">{error}</p>
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

      {!selectedInstitution && !canSearch && (
        <p className="text-sm text-primary-500 text-center mt-4 animate-fadeIn">
          Start typing to search for your bank
        </p>
      )}
    </StepContainer>
  )
}

const TONES = {
  green: {
    box: 'bg-green-50 border-green-300',
    iconWrap: 'bg-green-100',
    icon: 'text-green-600',
    title: 'text-green-900',
    text: 'text-green-800',
    detail: 'text-green-700 bg-green-100',
  },
  yellow: {
    box: 'bg-yellow-50 border-yellow-300',
    iconWrap: 'bg-yellow-100',
    icon: 'text-yellow-600',
    title: 'text-yellow-900',
    text: 'text-yellow-800',
    detail: 'text-yellow-700 bg-yellow-100',
  },
}

const VerificationCard = ({ tone, icon: Icon, title, summary, children }) => {
  const t = TONES[tone]
  return (
    <div className={`p-4 sm:p-5 border-2 rounded-xl ${t.box}`}>
      <div className="flex items-start space-x-3">
        <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${t.iconWrap}`}>
          <Icon className={`w-5 h-5 ${t.icon}`} />
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold mb-1 ${t.title}`}>{title}</h3>
          <p className={`text-sm mb-2 ${t.text}`}>{summary}</p>
          <div className={`text-xs rounded-lg p-3 mt-2 space-y-2 ${t.detail}`}>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default BankInstitution
