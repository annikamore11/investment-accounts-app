'use client'

import dynamic from 'next/dynamic'

const JourneyFlow = dynamic(() => import('@/components/JourneyFlow'), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>
})

export default function JourneyPage() {
  return <JourneyFlow />
}