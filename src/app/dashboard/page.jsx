'use client'

import { Suspense } from 'react'
import Dashboard from '@/components/user/Dashboard'

function DashboardContent() {
  return <Dashboard />
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}