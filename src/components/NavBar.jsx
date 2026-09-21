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
  // "/" already handles starting/continuing/resuming the journey itself
  // (see Landing.jsx), so the nav's journey link would just duplicate
  // whatever's already on screen there.
  const showJourneyLink = pathname !== '/'

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <nav className="bg-zinc-950 z-50 fixed top-0 left-0 right-0">
      <div className="w-full mx-auto px-8 pt-2">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/assets/logo/Title.svg"
                alt="Company Title"
                className="h-20 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {showJourneyLink && (
              <Link href="/journey" className="text-primary-50 hover:text-primary-200 px-3 py-2">
                {user ? 'Continue Journey' : 'Start Journey'}
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="btn-border">
                  Dashboard
                </Link>
                <button onClick={handleSignOut} className="btn-secondary">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="btn-border">
                  Sign In
                </Link>
                <Link href="/login?mode=signup" className="btn-secondary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary-100 hover:text-primary-200 focus:outline-none"
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
        <div className="md:hidden bg-zinc-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block text-gray-100 hover:text-primary-200 hover:bg-zinc-800 px-3 py-2 rounded-md font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            {showJourneyLink && (
              <Link
                href="/journey"
                className="block text-primary-100 hover:text-primary-200 hover:bg-zinc-800 px-3 py-2 rounded-md font-medium"
                onClick={() => setIsOpen(false)}
              >
                {user ? 'Continue Journey' : 'Start Journey'}
              </Link>
            )}
            {user && (
              <Link
                href="/dashboard"
                className="block text-primary-100 hover:text-primary-200 hover:bg-zinc-800 px-3 py-2 rounded-md font-medium"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            )}

            {user ? (
              <button
                onClick={() => {
                  handleSignOut()
                  setIsOpen(false)
                }}
                className="block w-full text-left text-primary-100 hover:text-primary-200 hover:bg-zinc-800 px-3 py-2 rounded-md font-medium"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="block text-primary-100 hover:text-primary-200 hover:bg-zinc-800 px-3 py-2 rounded-md font-medium"
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
