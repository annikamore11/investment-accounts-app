'use client'

import { ClerkProvider, useAuth as useClerkAuth } from '@clerk/nextjs'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { convex } from '@/utils/convex'
import { AuthProvider } from '@/context/AuthContext'
import { ChromeProvider, useChrome } from '@/context/ChromeContext'
import Navbar from './NavBar'
import Footer from './Footer'

const Chrome = ({ children }) => {
  const { hideFooter } = useChrome()
  return (
    <>
      <Navbar />
      <main className="grow">{children}</main>
      {!hideFooter && <Footer />}
    </>
  )
}

export default function ClientLayout({ children }) {
  return (
    <ClerkProvider>
      {/* Keeps the Convex client's auth token in sync with Clerk's session */}
      <ConvexProviderWithClerk client={convex} useAuth={useClerkAuth}>
        <AuthProvider>
          <ChromeProvider>
            <Chrome>{children}</Chrome>
          </ChromeProvider>
        </AuthProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}
