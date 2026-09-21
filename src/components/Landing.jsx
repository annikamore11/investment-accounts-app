'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { readGuestJourney, hasAnswers } from '@/utils/guestJourney'

const JourneyFlow = dynamic(() => import('@/components/journey/JourneyFlow'), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>,
})

// Keep in sync with the section ids in journey/sections/index.js
const SECTION_TITLES = {
  welcome: 'Welcome',
  aboutYou: 'About You',
  budget: 'Expenses & Income',
  emergencyFund: 'Emergency Fund',
  retirement: 'Retirement Accounts',
  investing: 'Non-Retirement Investing',
}

/**
 * The root route is state-driven rather than a fixed marketing page:
 *  - signed in           -> their plan lives at /dashboard
 *  - guest with progress -> a short "welcome back", not the pitch again
 *  - true cold visitor   -> the journey itself (its first step *is* the pitch)
 */
export default function Landing() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [state, setState] = useState('checking') // 'checking' | 'guest-progress' | 'start'
  const [guestProgress, setGuestProgress] = useState(null)

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [loading, user, router])

  useEffect(() => {
    if (loading || user) return
    let cancelled = false
    // Wrapped as async so this reads as "check external storage, then
    // sync state" rather than a synchronous compute-in-effect.
    ;(async () => {
      const saved = readGuestJourney()
      if (cancelled) return
      if (saved && hasAnswers(saved.data)) {
        setGuestProgress(saved)
        setState('guest-progress')
      } else {
        setState('start')
      }
    })()
    return () => { cancelled = true }
  }, [loading, user])

  // Avoid flashing the journey before we know whether to redirect
  if (loading || user || state === 'checking') return null

  if (state === 'guest-progress') {
    return <WelcomeBackCard sectionTitle={SECTION_TITLES[guestProgress.section] || 'your plan'} />
  }

  return <JourneyFlow />
}

const WelcomeBackCard = ({ sectionTitle }) => {
  const router = useRouter()

  return (
    <div className="min-h-screen static-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-primary-100 rounded-xl shadow-2xl p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
        <p className="text-gray-600 mb-6">
          You&apos;re partway through your plan — you left off on <strong>{sectionTitle}</strong>.
        </p>
        <button
          onClick={() => router.push('/journey')}
          className="w-full inline-flex items-center justify-center gap-2 btn-secondary px-6 py-3"
        >
          Continue <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
