'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SignIn, SignUp } from '@clerk/nextjs'
import { useAuth } from '@/context/AuthContext'

// Clerk's prebuilt widgets replace the old hand-rolled email/password form —
// password strength, email verification, and error states come for free
// instead of the app maintaining its own copies of all of that. This is the
// one page that looks visibly different from the rest of the app (Clerk's
// own widget chrome, themed to roughly match via `appearance` below).
const CLERK_APPEARANCE = {
  variables: {
    colorPrimary: '#16a34a', // accent-green-600
  },
}

const Login = () => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isSignup = searchParams.get('mode') === 'signup'

  // Already signed in? There's nothing to do here.
  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [loading, user, router])

  if (loading || user) return null

  return (
    <div className="min-h-screen static-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {isSignup ? (
        <SignUp
          routing="hash"
          signInUrl="/login"
          fallbackRedirectUrl="/journey"
          appearance={CLERK_APPEARANCE}
        />
      ) : (
        <SignIn
          routing="hash"
          signUpUrl="/login?mode=signup"
          fallbackRedirectUrl="/dashboard"
          appearance={CLERK_APPEARANCE}
        />
      )}
    </div>
  )
}

export default Login
