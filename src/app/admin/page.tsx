'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, Trophy, TrendingUp, Activity, BarChart3 } from 'lucide-react'
import { onAuthStateChange } from '@/lib/firebase/auth'
import { getAllUsers, getAllProgress, getChallenges, AdminUser } from '@/lib/firebase/admin'
import { UserProgress } from '@/types'

interface AdminStats {
  totalUsers: number
  totalChallenges: number
  totalCompletions: number
  averageScore: number
  completionRate: number
  activeToday: number
}

interface UserStat {
  userId: string
  userName: string
  challengesCompleted: number
  totalPoints: number
  lastActive: Date
}

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [topUsers, setTopUsers] = useState<UserStat[]>([])
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      console.log('🔍 Current user:', user?.email)

      if (!user) {
        console.log('❌ No user, redirecting to login')
        router.push('/login')
        return
      }

      const adminEmails = [
        'joshuaviera@pursuit.org',
        'admin@pursuit.org'
      ]
      const userIsAdmin = adminEmails.includes(user.email || '')

      console.log('🔐 User is admin?', userIsAdmin, 'Email:', user.email)

      if (!userIsAdmin) {
        console.log('❌ Not admin, redirecting to dashboard')
        router.push('/dashboard')
        return
      }

      console.log('✅ Admin access granted!')
      setIsAdmin(true)
      await loadAdminData()
      setLoading(false)
    })

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const loadAdminData = async () => {
    try {
      console.log('📊 Loading admin data...')
      const users = await getAllUsers()
      const progress = await getAllProgress()
      const challenges = await getChallenges()

      console.log('✅ Data loaded:', {
        users: users.length,
        progress: progress.length,
        challenges: challenges.length
      })

      const totalCompletions = progress.filter((p: UserProgress) => p.status === 'completed').length
      const avgScore =
        progress.reduce((sum: number, p: UserProgress) => sum + (p.score || 0), 0) /
          progress.length || 0

      setStats({
        totalUsers: users.length,
        totalChallenges: challenges.length,
        totalCompletions,
        averageScore: Math.round(avgScore),
        completionRate:
          users.length > 0 && challenges.length > 0
            ? (totalCompletions / (users.length * challenges.length)) * 100
            : 0,
        activeToday: users.filter((u: AdminUser) => isToday(u.lastLoginAt)).length,
      })

      const userStats = calculateUserStats(users, progress)
      setTopUsers(userStats.slice(0, 10))

      console.log('✅ Stats calculated successfully')
    } catch (error) {
      console.error('❌ Error loading admin data:', error)
    }
  }

  const calculateUserStats = (users: AdminUser[], progress: UserProgress[]): UserStat[] => {
    const userMap = new Map<string, UserStat>()

    users.forEach((user) => {
      userMap.set(user.uid, {
        userId: user.uid,
        userName: user.displayName || user.email || 'Unknown',
        challengesCompleted: 0,
        totalPoints: 0,
        lastActive: user.lastLoginAt,
      })
    })

    progress.forEach((p) => {
      const userStat = userMap.get(p.userId)
      if (userStat && p.status === 'completed') {
        userStat.challengesCompleted++
        userStat.totalPoints += p.score || 0
      }
    })

    return Array.from(userMap.values()).sort((a, b) => b.totalPoints - a.totalPoints)
  }

  const isToday = (date: Date): boolean => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="mt-2 text-gray-600">You do not have admin permissions.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Analytics Link */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-gray-600">Platform analytics and user management</p>
            </div>
            <Link
              href="/analytics"
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-700"
            >
              <BarChart3 className="h-5 w-5" />
              View Analytics
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Users className="h-6 w-6" />}
            label="Total Users"
            value={stats?.totalUsers || 0}
            color="blue"
          />
          <StatCard
            icon={<Trophy className="h-6 w-6" />}
            label="Completions"
            value={stats?.totalCompletions || 0}
            color="green"
          />
          <StatCard
            icon={<TrendingUp className="h-6 w-6" />}
            label="Avg Score"
            value={`${stats?.averageScore || 0}%`}
            color="purple"
          />
          <StatCard
            icon={<Activity className="h-6 w-6" />}
            label="Active Today"
            value={stats?.activeToday || 0}
            color="orange"
          />
        </div>

        {/* Completion Rate */}
        <div className="mb-6 rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Platform Overview</h2>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">Overall Completion Rate</span>
                <span className="font-semibold text-gray-900">
                  {stats?.completionRate.toFixed(1)}%
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-200">
                <div
                  className="h-3 rounded-full bg-green-500 transition-all"
                  style={{ width: `${stats?.completionRate || 0}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="text-2xl font-bold text-blue-600">{stats?.totalUsers || 0}</div>
                <div className="text-sm text-blue-700">Total Students</div>
              </div>
              <div className="rounded-lg bg-green-50 p-4">
                <div className="text-2xl font-bold text-green-600">{stats?.totalChallenges || 0}</div>
                <div className="text-sm text-green-700">Total Challenges</div>
              </div>
              <div className="rounded-lg bg-purple-50 p-4">
                <div className="text-2xl font-bold text-purple-600">{stats?.totalCompletions || 0}</div>
                <div className="text-sm text-purple-700">Total Completions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Users */}
        <div className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">🏆 Leaderboard - Top Students</h2>
          {topUsers.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <Trophy className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4">No completions yet</p>
              <p className="mt-1 text-sm">Check back once students start completing challenges!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm font-semibold text-gray-700">
                    <th className="pb-3">Rank</th>
                    <th className="pb-3">Student</th>
                    <th className="pb-3">Challenges Completed</th>
                    <th className="pb-3">Total Points</th>
                    <th className="pb-3">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {topUsers.map((user, index) => (
                    <tr key={user.userId} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          {index === 0 && <span className="text-2xl">🥇</span>}
                          {index === 1 && <span className="text-2xl">🥈</span>}
                          {index === 2 && <span className="text-2xl">🥉</span>}
                          <span className="font-bold text-gray-900">#{index + 1}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="font-medium text-gray-900">{user.userName}</div>
                      </td>
                      <td className="py-4">
                        <span className="text-gray-700">{user.challengesCompleted}</span>
                      </td>
                      <td className="py-4">
                        <span className="font-semibold text-primary-600">{user.totalPoints}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-gray-500">
                          {user.lastActive.toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
    <div className="rounded-lg border bg-white p-6 transition-all hover:shadow-md">
      <div className={`inline-flex rounded-lg p-3 ${colors[color as keyof typeof colors]}`}>
        {icon}
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        <div className="mt-1 text-sm text-gray-600">{label}</div>
      </div>
    </div>
  )
}