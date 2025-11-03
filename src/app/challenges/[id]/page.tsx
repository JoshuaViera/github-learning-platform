'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Lightbulb, CheckCircle, XCircle, Eye, RotateCcw } from 'lucide-react'
import { Terminal } from '@/components/learning/Terminal'
import { CommandExecutor } from '@/lib/git-simulator/CommandExecutor'
import { ValidationEngine } from '@/lib/git-simulator/ValidationEngine'
import { getCurrentUser } from '@/lib/firebase/auth'
import { getChallenge, updateUserProgress, markChallengeComplete } from '@/lib/firebase/challenges'
import Button from '@/components/ui/button'
import { Challenge } from '@/types'

export default function ChallengePage() {
  const router = useRouter()
  const params = useParams()
  const challengeId = params.id as string

  const [loading, setLoading] = useState(true)
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [executor] = useState(() => new CommandExecutor())
  const [validator] = useState(() => new ValidationEngine(executor.getGitEngine()))
  
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [validationResults, setValidationResults] = useState<any[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }

    setUserId(user.uid)
    loadChallenge()
  }, [router, challengeId])

  const loadChallenge = async () => {
    try {
      // Try Firestore first
      const firestoreChallenge = await getChallenge(challengeId)
      
      if (firestoreChallenge) {
        console.log('✅ Loaded challenge from Firestore')
        setChallenge(firestoreChallenge)
        setLoading(false)
        return
      }
    } catch (error) {
      console.error('⚠️ Firestore fetch failed:', error)
    }

    // Fallback to mock data
    const mockChallenges = getMockChallenges()
    const foundChallenge = mockChallenges[challengeId]
    
    if (foundChallenge) {
      console.log('📝 Using mock challenge data')
      setChallenge(foundChallenge)
    }
    
    setLoading(false)
  }

  const handleCommand = async (command: string) => {
    const result = await executor.execute(command)
    
    if (result.output === 'CLEAR_TERMINAL') {
      return { output: '', type: 'output' as const }
    }
    
    return result
  }

  const handleValidate = async () => {
    if (!challenge) return

    const results = validator.validateChallenge(challenge.validationTests)
    setValidationResults(results)

    const allPassed = validator.allTestsPassed(results)
    setIsComplete(allPassed)

    // Save to Firestore if user is logged in
    if (allPassed && userId) {
      try {
        await markChallengeComplete(userId, challenge.id, challenge.points)
        console.log('✅ Progress saved to Firestore')
      } catch (error) {
        console.error('⚠️ Failed to save progress:', error)
      }
    }
  }

  const handleReset = () => {
    executor.reset()
    setValidationResults([])
    setIsComplete(false)
    setShowSolution(false)
    setHintsUsed(0)
    window.location.reload()
  }

  const handleShowHint = async () => {
    if (challenge && hintsUsed < challenge.hints.length) {
      setHintsUsed(hintsUsed + 1)
      
      // Track hints used in Firestore
      if (userId) {
        try {
          await updateUserProgress(userId, challenge.id, {
            hintsUsed: hintsUsed + 1,
            status: 'in_progress',
          })
        } catch (error) {
          console.error('⚠️ Failed to save hint usage:', error)
        }
      }
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Challenge not found</h1>
          <Link href="/challenges" className="mt-4 text-primary-600 hover:text-primary-700">
            Back to challenges
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link
              href="/challenges"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Back to Challenges</span>
            </Link>
          </div>

          <Button onClick={handleReset} variant="outline" size="sm">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                  {challenge.difficulty}
                </span>
                <span className="text-sm text-gray-500">{challenge.points} points</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{challenge.title}</h1>
              <p className="mt-2 text-gray-600">{challenge.description}</p>
            </div>

            <Terminal onCommand={handleCommand} />

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={handleValidate} size="lg">
                <CheckCircle className="mr-2 h-5 w-5" />
                Check Solution
              </Button>
              
              <Button
                onClick={handleShowHint}
                variant="outline"
                size="lg"
                disabled={hintsUsed >= challenge.hints.length}
              >
                <Lightbulb className="mr-2 h-5 w-5" />
                Hint ({hintsUsed}/{challenge.hints.length})
              </Button>

              <Button
                onClick={() => setShowSolution(!showSolution)}
                variant="outline"
                size="lg"
              >
                <Eye className="mr-2 h-5 w-5" />
                {showSolution ? 'Hide' : 'Show'} Solution
              </Button>
            </div>

            {validationResults.length > 0 && (
              <div className="mt-6 rounded-lg border bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Test Results</h3>
                <div className="space-y-3">
                  {validationResults.map((result) => (
                    <div
                      key={result.testId}
                      className="flex items-start gap-3 rounded-lg border p-3"
                    >
                      {result.passed ? (
                        <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{result.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {isComplete && (
                  <div className="mt-6 rounded-lg bg-green-50 p-4 text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                    <h4 className="mt-2 text-lg font-semibold text-green-900">
                      Challenge Complete! 🎉
                    </h4>
                    <p className="mt-1 text-sm text-green-700">
                      You earned {challenge.points} points!
                    </p>
                    <Link href="/challenges">
                      <Button className="mt-4">Next Challenge</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Instructions</h3>
              <p className="text-sm text-gray-700">{challenge.instructions}</p>
            </div>

            {hintsUsed > 0 && (
              <div className="rounded-lg border bg-blue-50 p-6">
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-blue-900">
                  <Lightbulb className="h-5 w-5" />
                  Hints
                </h3>
                <div className="space-y-2">
                  {challenge.hints.slice(0, hintsUsed).map((hint, index) => (
                    <p key={hint.id} className="text-sm text-blue-800">
                      {index + 1}. {hint.text}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {showSolution && (
              <div className="rounded-lg border bg-yellow-50 p-6">
                <h3 className="mb-3 text-lg font-semibold text-yellow-900">Solution</h3>
                <div className="space-y-3">
                  <div>
                    <p className="mb-2 text-sm font-medium text-yellow-800">Commands:</p>
                    <code className="block rounded bg-yellow-100 p-3 font-mono text-xs text-yellow-900">
                      {challenge.solution.commands.join('\n')}
                    </code>
                  </div>
                  <p className="text-sm text-yellow-800">{challenge.solution.explanation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

// Mock data fallback
function getMockChallenges(): Record<string, Challenge> {
  return {
    '1': {
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
    '2': {
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
    '3': {
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
  }
}