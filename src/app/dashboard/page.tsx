'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { onAuthStateChange, signOut, getCurrentUser } from '@/lib/firebase/auth'
import { User } from 'firebase/auth'
import { GitBranch, LogOut, Loader2, ArrowRight, Code2, Trophy } from 'lucide-react'
import Button from '@/components/ui/button'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push('/login')
      return
    }

    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setUser(user)
        setLoading(false)
      } else {
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <GitBranch className="h-6 w-6 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Git Learning Platform</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {user?.photoURL && (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user?.displayName}</p>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome, {user?.displayName?.split(' ')[0]}! 👋
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Ready to master Git and GitHub? Let&apos;s get started.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Playground Card */}
          <Link
            href="/playground"
            className="group rounded-xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-primary-600 hover:shadow-lg"
          >
            <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary-100 p-3 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
              <GitBranch className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Git Playground</h3>
            <p className="text-gray-600">
              Practice Git commands in a safe, simulated terminal environment.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary-600 group-hover:text-primary-700">
              Try it now
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          {/* Coming Soon Cards */}
          <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6">
            <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-gray-200 p-3">
              <Code2 className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Challenges</h3>
            <p className="text-gray-600">
              Interactive Git challenges with hints and validation.
            </p>
            <div className="mt-4 text-sm text-gray-500">Coming soon...</div>
          </div>

          <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6">
            <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-gray-200 p-3">
              <Trophy className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Achievements</h3>
            <p className="text-gray-600">
              Earn badges and track your learning progress.
            </p>
            <div className="mt-4 text-sm text-gray-500">Coming soon...</div>
          </div>
        </div>
      </main>
    </div>
  )
}