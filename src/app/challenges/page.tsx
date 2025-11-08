// src/app/challenges/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Code2, Clock, Trophy, ArrowLeft } from 'lucide-react'
import { onAuthStateChange } from '@/lib/firebase/auth'
import { getAllChallenges } from '@/lib/firebase/challenges'
import { Challenge } from '@/types'

export default function ChallengesListPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [challenges, setChallenges] = useState<Challenge[]>([])

  useEffect(() => {
    console.log('🔵 ChallengesListPage: Component mounted')
    
    const unsubscribe = onAuthStateChange(async (user) => {
      console.log('🔵 Auth state changed:', user ? user.email : 'No user')
      
      if (!user) {
        console.log('❌ No user, redirecting to login')
        router.push('/login')
        return
      }

      console.log('✅ User authenticated:', user.uid)

      try {
        console.log('🔍 Calling getAllChallenges()...')
        const fetchedChallenges = await getAllChallenges()
        console.log('✅ Received challenges:', fetchedChallenges.length)
        console.log('📊 Challenge titles:', fetchedChallenges.map(c => c.title))
        setChallenges(fetchedChallenges)
      } catch (error) {
        console.error('❌ Error loading challenges:', error)
      } finally {
        console.log('🏁 Setting loading to false')
        setLoading(false)
      }
    })

    return () => {
      console.log('🔴 Cleaning up auth listener')
      unsubscribe()
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Git Challenges</h1>
          <p className="mt-2 text-gray-600">
            Complete challenges to learn Git commands and earn points
          </p>
        </div>

        {challenges.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
            <Code2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No challenges found</h3>
            <p className="mt-2 text-gray-600">
              Run <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">npm run seed</code> to add challenges
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Check the browser console for detailed logs
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge) => (
              <Link
                key={challenge.id}
                href={`/challenges/${challenge.id}`}
                className="group rounded-lg border bg-white p-6 transition-all hover:border-primary-600 hover:shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      challenge.difficulty === 'beginner'
                        ? 'bg-green-100 text-green-700'
                        : challenge.difficulty === 'intermediate'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {challenge.difficulty}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Trophy className="h-4 w-4" />
                    <span>{challenge.points} pts</span>
                  </div>
                </div>

                <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-primary-600">
                  {challenge.title}
                </h3>
                <p className="mb-4 line-clamp-2 text-sm text-gray-600">{challenge.description}</p>

                {challenge.estimatedTimeMinutes && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>~{challenge.estimatedTimeMinutes} min</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}