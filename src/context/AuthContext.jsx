'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
import { saveJourneyToDatabase } from '../utils/JourneyStorage'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  // On login, ALWAYS load existing data, NEVER migrate guest data
  if (data?.user && typeof window !== 'undefined') {
    console.log('✅ Login successful - using existing saved data')
    localStorage.removeItem('journey_guest') // Clean up guest data
  }
  
  return { data, error }
}

const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  
  // On signup ONLY, migrate guest data if it exists
  if (data?.user && typeof window !== 'undefined') {
    const guestData = localStorage.getItem('journey_guest')
    if (guestData) {
      try {
        const parsed = JSON.parse(guestData)
        
        // Check if guest data has content
        const hasContent = parsed.data && Object.values(parsed.data).some(value => {
          if (typeof value === 'object' && value !== null) {
            return Object.values(value).some(v => v !== false && v !== null && v !== '')
          }
          return value !== '' && value !== null && value !== false
        })
        
        if (hasContent) {
          console.log('✅ New signup - migrating guest data')
          await saveJourneyToDatabase(
            data.user.id,
            parsed.data,
            parsed.section || 'welcome',
            parsed.stepInSection || 0
          )
          localStorage.removeItem('journey_guest')
        } else {
          console.log('⏭️ Skipping migration - guest data is empty')
          localStorage.removeItem('journey_guest')
        }
      } catch (err) {
        console.error('Error migrating guest data on signup:', err)
      }
    }
  }
  
  return { data, error }
}

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}