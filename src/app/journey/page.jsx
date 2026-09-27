'use client'

import dynamic from 'next/dynamic'
import PlaneGlyph from '@/components/PlaneGlyph'

const JourneyFlow = dynamic(() => import('@/components/journey/JourneyFlow'), {
  ssr: false,
  loading: () => (
    <div className="journey-theme min-h-screen journey-background flex flex-col items-center justify-center gap-3">
      <span className="plane-ready-for-takeoff-wrap">
        <PlaneGlyph className="w-14 h-8 text-primary-300 plane-ready-for-takeoff" />
      </span>
      <p className="text-sm text-primary-400">Loading your flight plan…</p>
    </div>
  ),
})

export default function JourneyPage() {
  return <JourneyFlow />
}