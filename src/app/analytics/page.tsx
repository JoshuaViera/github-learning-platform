// src/app/analytics/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  TrendingUp,
  Target,
  Award,
  BarChart3,
} from 'lucide-react'
import { onAuthStateChange } from '@/lib/firebase/auth'
import { getAllProgress, getChallenges, UserProgressRecord } from '@/lib/firebase/admin'

interface ChallengeStats {
  id: string
  title: string
  difficulty: string
  attempts: number
  completions: number
  completionRate: number
  avgAttempts: number
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [challengeStats, setChallengeStats] = useState<ChallengeStats[]>([])

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (!user) {
        router.push('/login')
        return
      }

      const adminEmails = ['joshuaviera@pursuit.org', 'admin@pursuit.org']
      if (!adminEmails.includes(user.email || '')) {
        router.push('/dashboard')
        return
      }

      setIsAdmin(true)
      await loadAnalytics()
      setLoading(false)
    })

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const loadAnalytics = async () => {
    try {
      const challenges = await getChallenges()
      const progress = await getAllProgress()

      const stats = challenges.map((challenge) => {
        const challengeProgress = progress.filter((p: UserProgressRecord) => p.challengeId === challenge.id)
        const completed = challengeProgress.filter((p: UserProgressRecord) => p.status === 'completed').length
        const avgAttempts =
          challengeProgress.reduce((sum: number, p: UserProgressRecord) => sum + (p.attempts || 0), 0) /
            challengeProgress.length || 0

        return {
          id: challenge.id,
          title: challenge.title,
          difficulty: challenge.difficulty,
          attempts: challengeProgress.length,
          completions: completed,
          completionRate:
            challengeProgress.length > 0 ? (completed / challengeProgress.length) * 100 : 0,
          avgAttempts: Math.round(avgAttempts),
        }
      })

      setChallengeStats(stats.sort((a, b) => b.attempts - a.attempts))
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Admin</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Challenge Analytics</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <StatCard
            icon={<BarChart3 className="h-6 w-6" />}
            label="Total Challenges"
            value={challengeStats.length}
            color="blue"
          />
          <StatCard
            icon={<Target className="h-6 w-6" />}
            label="Total Attempts"
            value={challengeStats.reduce((sum, c) => sum + c.attempts, 0)}
            color="green"
          />
          <StatCard
            icon={<Award className="h-6 w-6" />}
            label="Total Completions"
            value={challengeStats.reduce((sum, c) => sum + c.completions, 0)}
            color="purple"
          />
          <StatCard
            icon={<TrendingUp className="h-6 w-6" />}
            label="Avg Completion Rate"
            value={`${(
              challengeStats.reduce((sum, c) => sum + c.completionRate, 0) /
                challengeStats.length || 0
            ).toFixed(1)}%`}
            color="orange"
          />
        </div>

        <div className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Challenge Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm font-semibold text-gray-700">
                  <th className="pb-3">Challenge</th>
                  <th className="pb-3">Difficulty</th>
                  <th className="pb-3">Attempts</th>
                  <th className="pb-3">Completions</th>
                  <th className="pb-3">Success Rate</th>
                  <th className="pb-3">Avg Attempts</th>
                </tr>
              </thead>
              <tbody>
                {challengeStats.map((stat) => (
                  <tr key={stat.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3">{stat.title}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                          stat.difficulty === 'beginner'
                            ? 'bg-green-100 text-green-700'
                            : stat.difficulty === 'intermediate'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {stat.difficulty}
                      </span>
                    </td>
                    <td className="py-3">{stat.attempts}</td>
                    <td className="py-3">{stat.completions}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{ width: `${stat.completionRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{stat.completionRate.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600">{stat.avgAttempts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  color: string
}) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  }

  return (
    <div className="rounded-lg border bg-white p-6">
      <div className={`inline-flex rounded-lg p-3 ${colors[color as keyof typeof colors]}`}>
        {icon}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    </div>
  )
}