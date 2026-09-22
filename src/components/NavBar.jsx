'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useAuth } from '@/context/AuthContext'
import { Menu, X } from 'lucide-react'

// Themes Clerk's own avatar+name popover to sit on the dark nav bar instead
// of Clerk's light default — handles the avatar image, initials fallback,
// "Manage account"/"Sign out" popover, and sign-out redirect itself, so
// there's no custom dropdown to build or keep in sync with Clerk's UI.
//
// baseTheme: dark (not just an `elements` className override) matters here:
// Clerk's default text color is `inherit`, and nothing in the navbar sets
// an ambient light text color, so without this the name renders as dark
// text on the dark navbar — present in the DOM, just invisible. The dark
// base theme sets a consistent light-on-dark palette for both the navbar
// trigger AND the popover card (which needs the opposite background), so
// overriding just one element's text color would have fixed the trigger
// while breaking the popover's own contrast.
const userButtonAppearance = {
  baseTheme: dark,
  elements: {
    userButtonOuterIdentifier: 'text-primary-50 text-sm font-medium',
    avatarBox: 'w-9 h-9',
  },
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const pathname = usePathname()
  // /journey already has its own in-page navigation, so the nav's link
  // there would just duplicate what's on screen.
  const showJourneyLink = pathname !== '/journey'

  return (
    <nav className="journey-theme bg-primary-900 z-50 fixed top-0 left-0 right-0 border-b border-primary-700/60">
      <div className="w-full mx-auto px-8 pt-2">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/assets/logo/Title.svg"
                alt="FundJoi"
                className="h-20 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <UserButton afterSignOutUrl="/" showName appearance={userButtonAppearance} />
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="px-5 py-2 rounded-lg text-sm border border-accent-green-500 text-accent-green-400 hover:bg-accent-green-950/40 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/login?mode=signup"
                  className="px-5 py-2 rounded-lg text-sm bg-accent-green-600 text-primary-50 hover:bg-accent-green-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: signed in, just the avatar — its own popover covers
              account/sign-out, and there's nowhere else to send a signed-in
              user (they get home via the logo or the back button). Signed
              out, the hamburger still opens Home/Start Journey/Login. */}
          <div className="md:hidden flex items-center">
            {user ? (
              <UserButton afterSignOutUrl="/" appearance={userButtonAppearance} />
            ) : (
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                className="min-h-11 min-w-11 flex items-center justify-center -mr-2 text-primary-100 hover:text-primary-50"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation (signed-out only) */}
      {isOpen && !user && (
        <div className="md:hidden bg-primary-800 border-t border-primary-700/60">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block text-primary-100 hover:text-primary-50 hover:bg-primary-700/60 px-3 py-2 rounded-md font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            {showJourneyLink && (
              <Link
                href="/journey"
                className="block text-primary-100 hover:text-primary-50 hover:bg-primary-700/60 px-3 py-2 rounded-md font-medium"
                onClick={() => setIsOpen(false)}
              >
                Start Journey
              </Link>
            )}
            <Link
              href="/login"
              className="block text-primary-100 hover:text-primary-50 hover:bg-primary-700/60 px-3 py-2 rounded-md font-medium"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
