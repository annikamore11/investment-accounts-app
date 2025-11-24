import './globals.css'
import ClientLayout from '@/components/ClientLayout'

export const metadata = {
  title: 'Investment Education - Learn to Invest for Beginners',
  description: 'Personalized investment education guide. Learn about 401k, IRA, budgeting, and retirement planning step-by-step.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen overflow-x-hidden w-full">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
