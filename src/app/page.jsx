'use client'

import dynamic from 'next/dynamic'

const Home = dynamic(() => import('@/components/Home'), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>,
})

export default function Page() {
  return <Home />
}
