'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SignIn, SignUp } from '@clerk/nextjs'
import { useAuth } from '@/context/AuthContext'
import PlaneGlyph from '../PlaneGlyph'

// Clerk's prebuilt widgets replace the old hand-rolled email/password form —
// password strength, email verification, and error states come for free
// instead of the app maintaining its own copies of all of that. This is the
// one page that looks visibly different from the rest of the app (Clerk's
// own widget chrome, themed to roughly match via `appearance` below).
// colorPrimary is the journey-theme's forest interactive tone (not amber):
// Clerk assumes light text on top of this color for its own buttons, and
// amber-on-white would fail contrast where forest-on-white doesn't.
const CLERK_APPEARANCE = {
  variables: {
    colorPrimary: '#2F6B4F',
  },
}

const Login = () => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isSignup = searchParams.get('mode') === 'signup'

  // Already signed in? There's nothing to do here.
  useEffect(() => {
    if (!loading && user) router.replace('/journey')
  }, [loading, user, router])

  // Signing up/in is the moment a guest's flight plan actually gets saved —
  // worth the same dawn warmth as the marketing hero, and a quiet plane
  // touch instead of the old flat dark background this page shared with
  // Home. A brief pulsing glyph replaces the previous blank `return null`
  // while auth status resolves, so there's no stark flash before the form.
  if (loading || user) {
    return (
      <div className="journey-theme min-h-screen dawn-background flex items-center justify-center">
        <PlaneGlyph className="w-16 h-9 text-primary-300 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="journey-theme min-h-screen dawn-background flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 mb-6 text-primary-300">
        <PlaneGlyph className="w-8 h-4" />
        <p className="text-sm font-medium">
          {isSignup ? 'Start your flight plan' : 'Continue your flight plan'}
        </p>
      </div>
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
          fallbackRedirectUrl="/journey"
          appearance={CLERK_APPEARANCE}
        />
      )}
    </div>
  )
}

export default Login
