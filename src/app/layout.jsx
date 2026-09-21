import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import ClientLayout from '@/components/ClientLayout'

export const metadata = {
  title: 'FundJoi - Learn to Invest for Beginners',
  description:
    'A guided, step-by-step path to your first emergency fund, retirement account and brokerage account.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen overflow-x-hidden w-full">
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  )
}
