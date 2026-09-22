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
// they don't already have a saved journey. Checking that directly is more
// robust than trying to infer "was this a signup or a login" from Clerk's
// prebuilt <SignIn>/<SignUp> components.
//
// If the account DOES already have a saved journey, the guest progress is
// a real conflict, not something to silently throw away: this returns it
// as `conflict` instead, and the caller is responsible for asking the user
// which copy to keep (see resolveConflict* below).
//
// Only clears the local guest copy once it's actually confirmed saved (or
// the user has explicitly chosen to discard it) — otherwise a failed write
// (e.g. Convex wasn't authenticated yet) would silently and permanently
// lose the only copy of the user's progress.
const migrateGuestJourney = async () => {
  const guest = readGuestJourney()
  if (!guest || !hasAnswers(guest.data)) {
    localStorage.removeItem('journey_guest')
    return { conflict: null }
  }

  const { data: existing } = await loadJourneyFromDatabase()
  if (existing) {
    return {
      conflict: {
        guest,
        existingLastUpdated: existing.last_updated,
      },
    }
  }

  const { success } = await saveJourneyToDatabase(guest.data, guest.section || 'welcome', guest.stepInSection || 0)
  if (success) {
    localStorage.removeItem('journey_guest')
  }
  // else: leave journey_guest in place so the next sign-in retries instead
  // of the progress just vanishing.
  return { conflict: null }
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
  // user until the one-time guest-migration attempt (if any) finishes,
  // INCLUDING the time spent waiting on the user to resolve a conflict
  // below — JourneyFlow waits on this before it reads Convex, so it never
  // shows a stale journey that's about to be overwritten either way.
  const [migrating, setMigrating] = useState(false)
  // Set only when signing in finds BOTH a guest journey with real answers
  // AND an already-saved account journey — the user has to say which one
  // wins. Null the rest of the time.
  const [conflict, setConflict] = useState(null)

  useEffect(() => {
    if (!isSignedIn || !convexAuthenticated || didMigrate.current) return
    didMigrate.current = true
    ;(async () => {
      setMigrating(true)
      const { conflict: found } = await migrateGuestJourney()
      if (found) {
        setConflict(found)
      } else {
        setMigrating(false)
      }
    })()
  }, [isSignedIn, convexAuthenticated])

  // User chose to keep the answers they just gave as a guest: overwrite
  // the account's existing saved journey with them.
  const resolveConflictKeepGuest = async () => {
    if (!conflict) return
    const { data, section, stepInSection } = conflict.guest
    const { success } = await saveJourneyToDatabase(data, section || 'welcome', stepInSection || 0)
    if (success) {
      localStorage.removeItem('journey_guest')
      setConflict(null)
      setMigrating(false)
    }
    // else: leave the conflict up so the user can retry rather than losing
    // either copy to a transient error.
  }

  // User chose to keep what was already saved on their account: the guest
  // copy is discarded, matching the old (silent) behavior.
  const resolveConflictKeepExisting = () => {
    if (!conflict) return
    localStorage.removeItem('journey_guest')
    setConflict(null)
    setMigrating(false)
  }

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
      {conflict && (
        <GuestConflictModal
          existingLastUpdated={conflict.existingLastUpdated}
          onKeepGuest={resolveConflictKeepGuest}
          onKeepExisting={resolveConflictKeepExisting}
        />
      )}
    </AuthContext.Provider>
  )
}

// Shown when signing in finds unsaved guest progress AND an existing saved
// account journey — the two are irreconcilable (this app has no per-field
// merge), so the user picks which one survives rather than one silently
// clobbering the other.
const GuestConflictModal = ({ existingLastUpdated, onKeepGuest, onKeepExisting }) => {
  const [resolving, setResolving] = useState(null)

  const handle = async (which, action) => {
    setResolving(which)
    await action()
    setResolving(null)
  }

  const savedWhen = existingLastUpdated
    ? new Date(existingLastUpdated).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : null

  return (
    <div className="journey-theme fixed inset-0 bg-primary-900/60 flex items-center justify-center z-50 p-4">
      <div className="bg-primary-50 rounded-2xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-primary-900 mb-2">Keep which progress?</h3>
        <p className="text-primary-600 mb-6">
          You answered some questions on this device before signing in, but this account
          already has a saved plan{savedWhen ? ` from ${savedWhen}` : ''}. Keeping your saved
          plan will discard what you just answered; using your new answers will replace your
          saved plan with them.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => handle('existing', onKeepExisting)}
            disabled={resolving !== null}
            className="flex-1 px-4 py-2 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors disabled:opacity-60"
          >
            {resolving === 'existing' ? 'Keeping…' : 'Keep my saved plan'}
          </button>
          <button
            onClick={() => handle('guest', onKeepGuest)}
            disabled={resolving !== null}
            className="flex-1 px-4 py-2 bg-accent-green-600 text-white rounded-lg hover:bg-accent-green-700 transition-colors disabled:opacity-60"
          >
            {resolving === 'guest' ? 'Saving…' : 'Use my new answers'}
          </button>
        </div>
      </div>
    </div>
  )
}
