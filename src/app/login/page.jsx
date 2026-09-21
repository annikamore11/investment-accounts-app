'use client'

import { Suspense } from 'react'
import Login from '@/components/user/Login'

// Login reads search params, which requires a Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <Login />
    </Suspense>
  )
}
