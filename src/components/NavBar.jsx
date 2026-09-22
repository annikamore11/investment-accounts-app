'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  // /journey already has its own in-page navigation, so the nav's link
  // there would just duplicate what's on screen.
  const showJourneyLink = pathname !== '/journey'

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

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
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSignOut}
                  className="px-5 py-2 rounded-lg font-semibold text-sm bg-accent-green-600 text-primary-50 hover:bg-accent-green-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="px-5 py-2 rounded-lg font-semibold text-sm border border-accent-green-500 text-accent-green-400 hover:bg-accent-green-950/40 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/login?mode=signup"
                  className="px-5 py-2 rounded-lg font-semibold text-sm bg-accent-green-600 text-primary-50 hover:bg-accent-green-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
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
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
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
                {user ? 'Continue Journey' : 'Start Journey'}
              </Link>
            )}
            {user ? (
              <button
                onClick={() => {
                  handleSignOut()
                  setIsOpen(false)
                }}
                className="block w-full text-left text-primary-100 hover:text-primary-50 hover:bg-primary-700/60 px-3 py-2 rounded-md font-medium"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="block text-primary-100 hover:text-primary-50 hover:bg-primary-700/60 px-3 py-2 rounded-md font-medium"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
