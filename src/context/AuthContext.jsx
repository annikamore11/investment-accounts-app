'use client'

import { createContext, useContext, useEffect, useRef } from 'react'
import { useUser, useClerk } from '@clerk/nextjs'
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
const migrateGuestJourney = async () => {
  const guest = readGuestJourney()
  if (guest && hasAnswers(guest.data)) {
    const { data: existing } = await loadJourneyFromDatabase()
    if (!existing) {
      await saveJourneyToDatabase(guest.data, guest.section || 'welcome', guest.stepInSection || 0)
    }
  }
  localStorage.removeItem('journey_guest')
}

export const AuthProvider = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser()
  const { signOut: clerkSignOut } = useClerk()
  const didMigrate = useRef(false)

  useEffect(() => {
    if (!isSignedIn || didMigrate.current) return
    didMigrate.current = true
    migrateGuestJourney()
  }, [isSignedIn])

  return (
    <AuthContext.Provider value={{ user, loading: !isLoaded, signOut: clerkSignOut }}>
      {children}
    </AuthContext.Provider>
  )
}
