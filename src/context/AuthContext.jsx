'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useUser, useClerk } from '@clerk/nextjs'
import { useConvexAuth } from 'convex/react'
import { loadJourneyFromDatabase, saveJourneyToDatabase } from '@/utils/JourneyStorage'
import { readGuestJourney, hasAnswers } from '@/utils/guestJourney'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// A guest's in-progress journey lives in localStorage; the first time this
// browser sees a signed-in user, move it into their account — but only if
// they don't already have a saved journey. That's the invariant that
// actually matters (never clobber real saved data), and checking it
// directly is more robust than trying to infer "was this a signup or a
// login" from Clerk's prebuilt <SignIn>/<SignUp> components.
//
// Only clears the local guest copy once it's actually confirmed saved —
// otherwise a failed write (e.g. Convex wasn't authenticated yet) would
// silently and permanently lose the only copy of the user's progress.
const migrateGuestJourney = async () => {
  const guest = readGuestJourney()
  if (!guest || !hasAnswers(guest.data)) {
    localStorage.removeItem('journey_guest')
    return
  }

  const { data: existing } = await loadJourneyFromDatabase()
  if (existing) {
    localStorage.removeItem('journey_guest')
    return
  }

  const { success } = await saveJourneyToDatabase(guest.data, guest.section || 'welcome', guest.stepInSection || 0)
  if (success) {
    localStorage.removeItem('journey_guest')
  }
  // else: leave journey_guest in place so the next sign-in retries instead
  // of the progress just vanishing.
}

export const AuthProvider = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser()
  const { signOut: clerkSignOut } = useClerk()
  // Clerk knowing "signed in" and Convex actually having a working
  // authenticated connection are two different, separately-async things —
  // ConvexProviderWithClerk still has to fetch and attach a fresh token.
  // Any Convex call issued before isAuthenticated flips true runs as
  // unauthenticated, which is indistinguishable from "no saved data".
  const { isLoading: convexLoading, isAuthenticated: convexAuthenticated } = useConvexAuth()
  const didMigrate = useRef(false)
  // True once from the moment Convex is actually ready for this signed-in
  // user until the one-time guest-migration attempt (if any) finishes.
  // JourneyFlow waits on this before it reads Convex.
  const [migrating, setMigrating] = useState(false)

  useEffect(() => {
    if (!isSignedIn || !convexAuthenticated || didMigrate.current) return
    didMigrate.current = true
    ;(async () => {
      setMigrating(true)
      await migrateGuestJourney()
      setMigrating(false)
    })()
  }, [isSignedIn, convexAuthenticated])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: !isLoaded || convexLoading,
        signOut: clerkSignOut,
        migrating,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
