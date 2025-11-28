'use client'

import { Suspense } from 'react'
import Login from '@/components/user/Login'

function LoginContent() {
  return <Login />
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}