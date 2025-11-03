'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, GitBranch, Loader2 } from 'lucide-react'
import { ChallengeCard } from '@/components/learning/ChallengeCard'
import { onAuthStateChange } from '@/lib/firebase/auth'
import { getChallenges, getUserProgress } from '@/lib/firebase/challenges'
import { Challenge } from '@/types'

export default function ChallengesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [completedChallenges, setCompletedChallenges] = useState<Map<string, boolean>>(new Map())
  const [dataSource, setDataSource] = useState<'firestore' | 'mock'>('mock')

  useEffect(() => {
    let mounted = true

    const unsubscribe = onAuthStateChange((user) => {
      if (!mounted) return

      setAuthChecked(true)

      if (!user) {
        router.push('/login')
        return
      }

      // Only load data once
      if (!authChecked) {
        loadChallenges()
        loadUserProgress(user.uid)
      }
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [router, authChecked])

  const loadChallenges = async () => {
    try {
      const firestoreChallenges = await getChallenges()
      
      if (firestoreChallenges.length > 0) {
        console.log('✅ Loaded challenges from Firestore:', firestoreChallenges.length)
        setChallenges(firestoreChallenges)
        setDataSource('firestore')
        setLoading(false)
        return
      }
      
      console.log('📝 Firestore empty, using mock data')
      const mockChallenges = getMockChallenges()
      setChallenges(mockChallenges)
      setDataSource('mock')
      setLoading(false)
    } catch (error) {
      console.error('⚠️ Firestore fetch failed, using mock data:', error)
      const mockChallenges = getMockChallenges()
      setChallenges(mockChallenges)
      setDataSource('mock')
      setLoading(false)
    }
  }

  const loadUserProgress = async (userId: string) => {
    try {
      const progress = await getUserProgress(userId)
      
      const completedMap = new Map<string, boolean>()
      progress.forEach(p => {
        if (p.status === 'completed') {
          completedMap.set(p.challengeId, true)
        }
      })
      
      console.log('✅ Loaded user progress:', progress.length, 'records')
      setCompletedChallenges(completedMap)
    } catch (error) {
      console.error('⚠️ Failed to load progress:', error)
    }
  }

  if (!authChecked || loading) {
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
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Git Challenges</h1>
              <p className="mt-2 text-gray-600">
                Complete these challenges to master Git commands and workflows.
              </p>
            </div>
            {dataSource === 'mock' && (
              <div className="rounded-lg bg-yellow-50 px-4 py-2 text-sm text-yellow-800">
                📝 Using demo data
              </div>
            )}
            {dataSource === 'firestore' && completedChallenges.size > 0 && (
              <div className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-800">
                ✅ {completedChallenges.size} completed
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              isLocked={false}
              isCompleted={completedChallenges.get(challenge.id) || false}
            />
          ))}
        </div>

        {challenges.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <GitBranch className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No challenges yet</h3>
            <p className="mt-2 text-gray-600">
              Challenges will appear here once they are added to the platform.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

// Mock data fallback
function getMockChallenges(): Challenge[] {
  return [
    {
      id: '1',
      moduleId: 'git-basics',
      title: 'Initialize Your First Repository',
      description: 'Learn how to create a new Git repository and understand what initialization means.',
      instructions: 'Use the git init command to create a new repository in your project folder.',
      orderIndex: 1,
      difficulty: 'beginner',
      estimatedTimeMinutes: 5,
      points: 10,
      startingFiles: [],
      expectedCommands: ['git init'],
      validationTests: [
        {
          id: 'test-1',
          description: 'Repository is initialized',
          gitCheck: { type: 'status', value: 'initialized' },
        },
      ],
      hints: [
        { id: 'hint-1', level: 1, text: 'Type git init to initialize a repository' },
      ],
      solution: {
        commands: ['git init'],
        explanation: 'The git init command creates a new Git repository in the current directory.',
      },
      tags: ['git', 'basics', 'init'],
      prerequisites: [],
      isPublished: true,
      createdBy: 'system',
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
      updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    },
    {
      id: '2',
      moduleId: 'git-basics',
      title: 'Making Your First Commit',
      description: 'Learn how to stage files and create your first commit with a meaningful message.',
      instructions: 'Initialize git, create a file called README.md, add it to staging, and commit it with a message containing the word initial.',
      orderIndex: 2,
      difficulty: 'beginner',
      estimatedTimeMinutes: 10,
      points: 15,
      startingFiles: [],
      expectedCommands: ['git init', 'touch README.md', 'git add README.md', 'git commit -m'],
      validationTests: [
        {
          id: 'test-1',
          description: 'Repository is initialized',
          gitCheck: { type: 'status', value: 'initialized' },
        },
        {
          id: 'test-2',
          description: 'At least one commit was made with initial in the message',
          gitCheck: { type: 'commit', value: 'initial' },
        },
      ],
      hints: [
        { id: 'hint-1', level: 1, text: 'First initialize git with git init' },
        { id: 'hint-2', level: 2, text: 'Create a file with touch README.md' },
        { id: 'hint-3', level: 3, text: 'Add the file with git add README.md' },
        { id: 'hint-4', level: 4, text: 'Commit with git commit -m "Initial commit"' },
      ],
      solution: {
        commands: ['git init', 'touch README.md', 'git add README.md', 'git commit -m "Initial commit"'],
        explanation: 'First initialize Git, create a file, stage it, then commit with a descriptive message.',
      },
      tags: ['git', 'basics', 'commit'],
      prerequisites: [],
      isPublished: true,
      createdBy: 'system',
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
      updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    },
    {
      id: '3',
      moduleId: 'git-basics',
      title: 'Working with Branches',
      description: 'Create a new branch and learn why branches are important for development.',
      instructions: 'Initialize git, create a new feature branch, and switch to it.',
      orderIndex: 3,
      difficulty: 'intermediate',
      estimatedTimeMinutes: 8,
      points: 20,
      startingFiles: [],
      expectedCommands: ['git init', 'git branch feature', 'git checkout feature'],
      validationTests: [
        {
          id: 'test-1',
          description: 'Git repository is initialized',
          gitCheck: { type: 'status', value: 'initialized' },
        },
        {
          id: 'test-2',
          description: 'Feature branch exists',
          gitCheck: { type: 'branch', value: 'feature' },
        },
      ],
      hints: [
        { id: 'hint-1', level: 1, text: 'First initialize git with git init' },
        { id: 'hint-2', level: 2, text: 'Create a branch with git branch feature' },
        { id: 'hint-3', level: 3, text: 'Switch branches with git checkout feature' },
      ],
      solution: {
        commands: ['git init', 'git branch feature', 'git checkout feature'],
        explanation: 'Initialize Git first, then create a branch and switch to it. Branches allow you to work on features independently.',
      },
      tags: ['git', 'branches'],
      prerequisites: [],
      isPublished: true,
      createdBy: 'system',
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
      updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    },
  ]
}