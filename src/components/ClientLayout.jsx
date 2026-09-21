'use client'

import { ClerkProvider, useAuth as useClerkAuth } from '@clerk/nextjs'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { convex } from '@/utils/convex'
import { AuthProvider } from '@/context/AuthContext'
import Navbar from './NavBar'
import Footer from './Footer'

export default function ClientLayout({ children }) {
  return (
    <ClerkProvider>
      {/* Keeps the Convex client's auth token in sync with Clerk's session */}
      <ConvexProviderWithClerk client={convex} useAuth={useClerkAuth}>
        <AuthProvider>
          <Navbar />
          <main className="grow">{children}</main>
          <Footer />
        </AuthProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}
