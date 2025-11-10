import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CryptoTrack - Cryptocurrency Asset Tracker',
  description: 'Track your favorite cryptocurrencies in real-time',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col`}>
        {/* Modern responsive layout with centered container */}
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
        <footer className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400">
            <p className="text-sm sm:text-base">© 2025 CryptoTrack - Built for Quantace Research Assessment</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
