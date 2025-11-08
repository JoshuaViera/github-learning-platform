// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GitHub Learning Platform | Learn Git & GitHub Interactively',
  description:
    'Master Git and GitHub through interactive challenges. Built for Pursuit students.',
  keywords: ['git', 'github', 'tutorial', 'learning', 'pursuit', 'bootcamp'],
  authors: [{ name: 'Joshua Viera' }],
  openGraph: {
    title: 'GitHub Learning Platform',
    description: 'Master Git and GitHub through interactive challenges',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}