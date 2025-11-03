'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, GitBranch, Loader2, ChevronDown, ChevronRight, Lock } from 'lucide-react'
import { ChallengeCard } from '@/components/learning/ChallengeCard'
import { onAuthStateChange } from '@/lib/firebase/auth'
import { getChallenges, getUserProgress } from '@/lib/firebase/challenges'
import { Challenge } from '@/types'
import { modules, Module } from '@/data/modules'

export default function ChallengesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [completedChallenges, setCompletedChallenges] = useState<Map<string, boolean>>(new Map())
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['git-basics']))
  const [dataSource, setDataSource] = useState<'firestore' | 'mock'>('mock')

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (!user) {
        router.push('/login')
        return
      }

      try {
        const firestoreChallenges = await getChallenges()
        
        if (firestoreChallenges.length > 0) {
          console.log('✅ Loaded challenges from Firestore:', firestoreChallenges.length)
          setChallenges(firestoreChallenges)
          setDataSource('firestore')
        } else {
          console.log('📝 No challenges in Firestore')
          setChallenges([])
          setDataSource('mock')
        }

        const progress = await getUserProgress(user.uid)
        const completedMap = new Map<string, boolean>()
        progress.forEach(p => {
          if (p.status === 'completed') {
            completedMap.set(p.challengeId, true)
          }
        })
        setCompletedChallenges(completedMap)
      } catch (error) {
        console.error('⚠️ Error loading data:', error)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId)
      } else {
        newSet.add(moduleId)
      }
      return newSet
    })
  }

  const getChallengesByModule = (moduleId: string) => {
    return challenges.filter(c => c.moduleId === moduleId)
  }

  const getModuleProgress = (moduleId: string) => {
    const moduleChallenges = getChallengesByModule(moduleId)
    const completed = moduleChallenges.filter(c => completedChallenges.get(c.id)).length
    return {
      completed,
      total: moduleChallenges.length,
      percentage: moduleChallenges.length > 0 ? (completed / moduleChallenges.length) * 100 : 0
    }
  }

  const isModuleLocked = (module: Module) => {
    if (module.prerequisites.length === 0) return false
    
    // Check if all prerequisite modules are 100% complete
    return module.prerequisites.some(prereqId => {
      const prereqProgress = getModuleProgress(prereqId)
      return prereqProgress.percentage < 100
    })
  }

  const getTotalProgress = () => {
    const completed = completedChallenges.size
    const total = challenges.length
    return {
      completed,
      total,
      points: completed * 20, // Average 20 points per challenge (rough estimate)
      percentage: total > 0 ? (completed / total) * 100 : 0
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  const totalProgress = getTotalProgress()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-2">
              <GitBranch className="h-6 w-6 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Challenges</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Overall Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Git Challenges</h1>
              <p className="mt-2 text-gray-600">
                Complete challenges to master Git commands and workflows.
              </p>
            </div>
            {dataSource === 'mock' && (
              <div className="rounded-lg bg-yellow-50 px-4 py-2 text-sm text-yellow-800">
                📝 Using demo data
              </div>
            )}
          </div>

          {/* Progress Stats */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">Your Progress</h2>
              <span className="text-sm text-gray-600">
                {totalProgress.completed} / {totalProgress.total} challenges
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${totalProgress.percentage}%` }}
              />
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>📊 {totalProgress.percentage.toFixed(0)}% Complete</span>
              <span>•</span>
              <span>⭐ ~{totalProgress.points} points earned</span>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-6">
          {modules.map((module) => {
            const moduleChallenges = getChallengesByModule(module.id)
            const progress = getModuleProgress(module.id)
            const isExpanded = expandedModules.has(module.id)
            const locked = isModuleLocked(module)

            return (
              <div key={module.id} className="bg-white rounded-lg border overflow-hidden">
                {/* Module Header */}
                <button
                  onClick={() => !locked && toggleModule(module.id)}
                  className={`w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${locked ? 'cursor-not-allowed opacity-60' : ''}`}
                  disabled={locked}
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-3xl`}>{module.icon}</div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-900">{module.title}</h3>
                        {locked && <Lock className="h-4 w-4 text-gray-400" />}
                      </div>
                      <p className="text-sm text-gray-600">{module.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>{module.totalChallenges} challenges</span>
                        <span>•</span>
                        <span>{module.totalPoints} points</span>
                        {progress.completed > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium">
                              {progress.completed}/{progress.total} completed
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Progress Circle */}
                    <div className="relative w-16 h-16">
                      <svg className="transform -rotate-90 w-16 h-16">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          className="text-gray-200"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress.percentage / 100)}`}
                          className={`${module.color.replace('bg-', 'text-')} transition-all duration-500`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-700">
                          {progress.percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    {!locked && (
                      isExpanded ? 
                        <ChevronDown className="h-5 w-5 text-gray-400" /> : 
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Module Challenges */}
                {isExpanded && !locked && (
                  <div className="px-6 py-4 bg-gray-50 border-t">
                    {moduleChallenges.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {moduleChallenges.map((challenge) => (
                          <ChallengeCard
                            key={challenge.id}
                            challenge={challenge}
                            isLocked={false}
                            isCompleted={completedChallenges.get(challenge.id) || false}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">
                        No challenges available in this module yet.
                      </p>
                    )}
                  </div>
                )}

                {/* Locked Message */}
                {locked && isExpanded && (
                  <div className="px-6 py-8 bg-gray-50 border-t text-center">
                    <Lock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium mb-1">Module Locked</p>
                    <p className="text-sm text-gray-500">
                      Complete {module.prerequisites.map(id => 
                        modules.find(m => m.id === id)?.title
                      ).join(' and ')} first
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {challenges.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center bg-white">
            <GitBranch className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No challenges yet</h3>
            <p className="mt-2 text-gray-600">
              Run the seed script to add challenges to your platform.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}