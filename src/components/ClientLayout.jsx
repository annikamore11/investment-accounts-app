'use client'

'use client'

import { AuthProvider } from '../context/AuthContext'
import Navbar from './NavBar'
import AnimatedFooter from './Footer'

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <Navbar />
      <main className="grow">
        {children}
      </main>
      <AnimatedFooter />
    </AuthProvider>
  )
}