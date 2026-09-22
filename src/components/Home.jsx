'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from 'convex/react'
import { ArrowRight, Check, User, Wallet, Shield, PiggyBank, TrendingUp } from 'lucide-react'
import { api } from '../../convex/_generated/api'
import { useAuth } from '@/context/AuthContext'
import { readGuestJourney, hasAnswers } from '@/utils/guestJourney'
import { SECTION_CONFIGS, INITIAL_JOURNEY_DATA, getSectionCompletion } from './journey/sections'
import MarketingLanding from './MarketingLanding'

// Welcome is just the pitch step, not a real content area — leave it out of
// the section grid below.
const DASHBOARD_SECTIONS = SECTION_CONFIGS.filter(s => s.id !== 'welcome')

const SECTION_ICONS = {
  aboutYou: User,
  budget: Wallet,
  emergencyFund: Shield,
  retirement: PiggyBank,
  investing: TrendingUp,
}

const SECTION_BLURBS = {
  aboutYou: 'Your employment, age, and banking basics',
  budget: 'Income, expenses, and any debt to pay down',
  emergencyFund: 'A cash cushion before you invest a dollar',
  retirement: '401(k) match and IRA contributions',
  investing: 'Goals, risk tolerance, and how to invest',
}

/**
 * "/" is the app's home base: a lightweight dashboard for a returning
 * visitor (signed-in or guest) with progress, and a simple pitch + CTA for
 * a cold visitor. The journey itself lives at /journey.
 */
export default function Home() {
  const { user, loading: authLoading } = useAuth()
  // undefined while Convex is loading, null once loaded with no saved journey yet
  const doc = useQuery(api.journey.get, user ? {} : 'skip')
  // Lazy initializer only, not an effect: this component is mounted
  // client-only (see the dynamic ssr:false import in app/page.jsx), so
  // there's no server-render to mismatch against.
  const [guestJourney] = useState(() => (user ? null : readGuestJourney()))

  if (authLoading) return null
  if (user && doc === undefined) return null

  const rawData = user ? doc?.journeyData : guestJourney?.data
  const journeyData = { ...INITIAL_JOURNEY_DATA, ...(rawData || {}) }
  const hasProgress = hasAnswers(journeyData)
  const lastSaved = user ? doc?.lastUpdated : guestJourney?.lastSaved

  // A true cold visitor — no account, no guest progress — gets the
  // marketing pitch instead of a dashboard that has nothing to show yet.
  if (!user && !hasProgress) return <MarketingLanding />

  const perSection = DASHBOARD_SECTIONS.map(section => ({
    section,
    ...getSectionCompletion(section, journeyData),
  }))
  const totalSteps = perSection.reduce((sum, s) => sum + s.steps.length, 0)
  const totalCompleted = perSection.reduce((sum, s) => sum + s.completedSteps.length, 0)
  const percent = totalSteps > 0 ? Math.round((totalCompleted / totalSteps) * 100) : 0

  const firstName = user?.firstName || user?.primaryEmailAddress?.emailAddress?.split('@')[0]

  return (
    <div className="min-h-screen static-background">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 md:pt-36 md:pb-24">
        <Hero firstName={firstName} hasProgress={hasProgress} percent={percent} lastSaved={lastSaved} />

        {!user && <GuestNudge hasProgress={hasProgress} />}

        <SectionGrid perSection={perSection} />
      </div>
    </div>
  )
}

const Hero = ({ firstName, hasProgress, percent, lastSaved }) => (
  <div className="text-center mb-14">
    <h1 className="text-3xl md:text-5xl font-bold text-primary-50 mb-4">
      {firstName ? `Welcome back, ${firstName}` : hasProgress ? 'Welcome back' : 'Build your financial plan, step by step'}
    </h1>
    <p className="text-primary-300 text-base md:text-lg max-w-2xl mx-auto mb-8">
      {hasProgress
        ? "Pick up right where you left off — we've saved your answers."
        : 'A short guided journey through budgeting, an emergency fund, retirement, and investing — tailored to your answers as you go.'}
    </p>

    <Link
      href="/journey"
      className="inline-flex items-center justify-center gap-2 btn-secondary px-8 py-3 text-base font-semibold"
    >
      {hasProgress ? 'Continue Your Journey' : 'Start Your Journey'}
      <ArrowRight className="w-5 h-5" />
    </Link>

    {hasProgress && (
      <div className="max-w-sm mx-auto mt-8">
        <div className="w-full bg-primary-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-accent-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-primary-400">
          <span>{percent}% complete</span>
          {lastSaved && <span>Saved {formatRelativeDate(lastSaved)}</span>}
        </div>
      </div>
    )}
  </div>
)

const GuestNudge = ({ hasProgress }) => (
  <div className="max-w-xl mx-auto mb-14 bg-accent-green-50/95 border-2 border-accent-green-300 rounded-xl p-4 text-center">
    <p className="text-sm text-accent-green-900">
      {hasProgress
        ? "You're only saved on this device."
        : 'Create a free account to save your plan and pick up anywhere.'}{' '}
      <Link href="/login?mode=signup" className="font-semibold underline hover:no-underline">
        Sign up free
      </Link>
    </p>
  </div>
)

const SectionGrid = ({ perSection }) => (
  <div>
    <h2 className="text-primary-100 font-semibold text-sm uppercase tracking-wide mb-4 text-center">
      What the journey covers
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {perSection.map(({ section, completedSteps, steps, isFullyCompleted }) => {
        const Icon = SECTION_ICONS[section.id]
        const inProgress = completedSteps.length > 0 && !isFullyCompleted
        return (
          <Link key={section.id} href="/journey" className="card flex flex-col gap-3 hover:no-underline">
            <div className="flex items-center justify-between">
              <div className="bg-accent-green-100 rounded-lg p-2.5 w-fit">
                {Icon && <Icon className="w-5 h-5 text-accent-green-700" />}
              </div>
              {isFullyCompleted && (
                <span className="flex items-center gap-1 text-xs font-semibold text-accent-green-700 bg-accent-green-100 px-2 py-1 rounded-full">
                  <Check className="w-3 h-3" /> Done
                </span>
              )}
              {inProgress && (
                <span className="text-xs font-semibold text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
                  {completedSteps.length}/{steps.length}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{section.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{SECTION_BLURBS[section.id]}</p>
            </div>
          </Link>
        )
      })}
    </div>
  </div>
)

const formatRelativeDate = (value) => {
  const date = typeof value === 'number' ? new Date(value) : new Date(value)
  const diffMs = Date.now() - date.getTime()
  const diffMins = Math.round(diffMs / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.round(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.round(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}
