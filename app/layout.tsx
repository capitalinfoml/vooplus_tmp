import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DroneFee — Price your drone services like a pro',
  description:
    'Calculate market rates, generate professional proposals, and close more clients. Used by drone operators in 40+ countries.',
  openGraph: {
    title: 'DroneFee',
    description: 'Professional pricing tools for drone operators worldwide.',
    siteName: 'DroneFee',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg-base text-text-primary antialiased">{children}</body>
    </html>
  )
}
