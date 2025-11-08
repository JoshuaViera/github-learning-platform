// src/app/challenges/[id]/page.tsx
'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Lightbulb, CheckCircle, Eye, RotateCcw } from 'lucide-react'
import { Terminal } from '@/components/learning/Terminal'
import { CommandExecutor } from '@/lib/git-simulator/CommandExecutor'
import { ValidationEngine } from '@/lib/git-simulator/ValidationEngine'
import { getCurrentUser } from '@/lib/firebase/auth'
import { getChallenge, updateUserProgress, markChallengeComplete } from '@/lib/firebase/challenges'
import Button from '@/components/ui/button'
import { Challenge } from '@/types'
import { GitVisualizer } from '@/lib/git-simulator/GitVisualizer'
import { CommandRecorder } from '@/lib/git-simulator/CommandRecorder'
import { GitTree } from '@/components/learning/GitTree'
import { CommandHistory } from '@/components/learning/CommandHistory'
import { SolutionModal } from '@/components/learning/SolutionModal'
import { ChallengeExplanation } from '@/components/learning/ChallengeExplanation'
import { Timestamp } from 'firebase/firestore'

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
  const [visualTree, setVisualTree] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const visualizer = useRef(new GitVisualizer())
  const recorder = useRef(new CommandRecorder())
  const playbackInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }

    setUserId(user.uid)
    loadChallenge()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, challengeId])

  const loadChallenge = async () => {
    try {
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

    const stateBefore = {}
    const stateAfter = executor.getGitEngine().getState()
    
    recorder.current.record(
      command,
      stateBefore,
      stateAfter,
      result.output || '',
      !result.output.includes('Error') && !result.output.includes('error')
    )

    if (stateAfter && stateAfter.commits) {
      const tree = visualizer.current.visualize(stateAfter)
      setVisualTree(tree)
    }
    
    return result
  }

  const handleValidate = async () => {
    if (!challenge) return

    const results = validator.validateChallenge(challenge.validationTests)
    setValidationResults(results)

    const allPassed = validator.allTestsPassed(results)
    setIsComplete(allPassed)

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
    recorder.current.reset()
    setVisualTree(null)
    setValidationResults([])
    setIsComplete(false)
    setShowSolution(false)
    setHintsUsed(0)
    if (playbackInterval.current) {
      clearInterval(playbackInterval.current)
      playbackInterval.current = null
    }
    setIsPlaying(false)
  }

  const handleShowHint = async () => {
    if (challenge && hintsUsed < challenge.hints.length) {
      setHintsUsed(hintsUsed + 1)
      
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

  const handlePlayPause = () => {
    if (isPlaying) {
      if (playbackInterval.current) {
        clearInterval(playbackInterval.current)
        playbackInterval.current = null
      }
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      playbackInterval.current = setInterval(() => {
        const next = recorder.current.goForward()
        if (!next) {
          if (playbackInterval.current) {
            clearInterval(playbackInterval.current)
            playbackInterval.current = null
          }
          setIsPlaying(false)
        } else {
          const tree = visualizer.current.visualize(next.gitStateAfter)
          setVisualTree(tree)
        }
      }, 1000)
    }
  }

  const handleStepBack = () => {
    const prev = recorder.current.goBack()
    if (prev) {
      const tree = visualizer.current.visualize(prev.gitStateBefore)
      setVisualTree(tree)
    }
  }

  const handleStepForward = () => {
    const next = recorder.current.goForward()
    if (next) {
      const tree = visualizer.current.visualize(next.gitStateAfter)
      setVisualTree(tree)
    }
  }

  const handleExport = () => {
    const script = recorder.current.exportAsScript()
    const blob = new Blob([script], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${challenge?.title.replace(/\s+/g, '-').toLowerCase()}-solution.sh`
    a.click()
    URL.revokeObjectURL(url)
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
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Challenge Header */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 capitalize">
                  {challenge.difficulty}
                </span>
                <span className="text-sm text-gray-500">{challenge.points} points</span>
                {challenge.estimatedTimeMinutes && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">~{challenge.estimatedTimeMinutes} min</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{challenge.title}</h1>
              <p className="mt-2 text-gray-600">{challenge.description}</p>
            </div>

            {/* Terminal */}
            <Terminal onCommand={handleCommand} />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
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

              {isComplete && (
                <Button
                  onClick={() => setShowSolution(true)}
                  variant="outline"
                  size="lg"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  View Solution
                </Button>
              )}
            </div>

            {/* Validation Results */}
            {validationResults.length > 0 && (
              <div className="rounded-lg border bg-white p-6">
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
                        <div className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-red-600" />
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

            {/* Git Visualization */}
            {visualTree ? (
              <GitTree tree={visualTree} />
            ) : (
              <div className="flex min-h-[300px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                <div className="text-center">
                  <div className="mx-auto mb-4 text-6xl">🌳</div>
                  <p className="text-gray-600">Git tree visualization will appear here</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Start running Git commands to see the magic!
                  </p>
                </div>
              </div>
            )}

            {/* Command History */}
            <CommandHistory
              history={recorder.current.getHistory()}
              currentIndex={recorder.current.getHistory().length - 1}
              onJumpTo={(index) => {
                const record = recorder.current.getHistory()[index]
                if (record) {
                  const tree = visualizer.current.visualize(record.gitStateAfter)
                  setVisualTree(tree)
                }
              }}
              onPlayPause={handlePlayPause}
              onStepBack={handleStepBack}
              onStepForward={handleStepForward}
              onReset={() => {
                recorder.current.reset()
                setVisualTree(null)
              }}
              onExport={handleExport}
              isPlaying={isPlaying}
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Explanation Section */}
            {challenge.explanation && (
              <ChallengeExplanation explanation={challenge.explanation} />
            )}

            {/* Instructions */}
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Instructions</h3>
              <div className="whitespace-pre-wrap text-sm text-gray-700">{challenge.instructions}</div>
            </div>

            {/* Hints */}
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

            {/* Solution Preview (Old Style) */}
            {showSolution && !isComplete && (
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

      {/* Solution Modal (New Style - Only shown when complete) */}
      {showSolution && isComplete && challenge && (
        <SolutionModal
          isOpen={showSolution}
          onClose={() => setShowSolution(false)}
          challenge={challenge}
          userCommands={recorder.current.getSuccessfulCommands()}
        />
      )}
    </div>
  )
}

// Mock data fallback with explanations
function getMockChallenges(): Record<string, Challenge> {
  const createTimestamp = (): Timestamp => {
    return Timestamp.fromDate(new Date())
  }

  return {
    '1': {
      id: '1',
      moduleId: 'git-basics',
      title: 'Initialize Your First Repository',
      description: 'Learn how to create a new Git repository and understand what initialization means.',
      instructions: 'Use the git init command to create a new repository in your project folder.',
      explanation: {
        overview: "You're learning to create a Git repository, which is like turning on 'version control' for a folder. Think of it as activating a superpower that lets your folder remember every change you make.",
        why: "Before you can use any Git features (saving versions, collaborating, etc.), you need to initialize a repository. This is always the very first step in any Git project. Every professional developer does this when starting a new project.",
        vocabulary: [
          {
            term: "Initialize",
            definition: "To set up or prepare something for first use. Like pressing 'Start' on a new video game save file.",
            example: "'git init' sets up Git tracking in your folder"
          },
          {
            term: "Repository (Repo)",
            definition: "A folder that Git is watching and tracking. It contains all your files plus a hidden .git folder with the complete history.",
            example: "After 'git init', your folder becomes a repository"
          },
          {
            term: ".git folder",
            definition: "A hidden folder that Git creates to store all tracking information. You never need to touch this directly.",
            example: "Created automatically when you run 'git init'"
          }
        ],
        realWorldExample: "Imagine starting a journal. Before writing anything, you first need to buy the journal book. 'git init' is like buying the journal - it sets up the space where you'll record your project's history.",
        commonMistakes: [
          "Running 'git init' multiple times (only need it once per project)",
          "Forgetting to run 'git init' before other Git commands",
          "Running 'git init' in the wrong folder"
        ]
      },
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
      createdAt: createTimestamp(),
      updatedAt: createTimestamp(),
    },
    '2': {
      id: '2',
      moduleId: 'git-basics',
      title: 'Making Your First Commit',
      description: 'Learn how to stage files and create your first commit with a meaningful message.',
      instructions: 'Initialize git, create a file called README.md, add it to staging, and commit it with a message containing the word "initial".',
      explanation: {
        overview: "You're learning the fundamental Git workflow: create a file, stage it, and commit it. This is the core pattern you'll use thousands of times as a developer. Every change you want to save follows these same steps.",
        why: "Commits are how you save progress in Git. Without commits, Git can't track any changes. Think of commits as checkpoints in a game - they're your safe points you can return to if something goes wrong.",
        vocabulary: [
          {
            term: "Staging Area",
            definition: "A preparation space where you put files before committing them. Like a shopping cart before checkout.",
            example: "'git add README.md' puts the file in staging"
          },
          {
            term: "Commit",
            definition: "A snapshot of your project at a specific moment. Like taking a photo of your work.",
            example: "'git commit -m message' creates the snapshot"
          },
          {
            term: "Commit Message",
            definition: "A short description explaining what changed in this commit. Helps you (and others) understand the history.",
            example: "\"Initial commit\" or \"Add login feature\""
          }
        ],
        realWorldExample: "Think of taking photos during a trip. First, you decide which moment to capture (staging), then you take the photo (commit), and finally you write a caption describing it (commit message). Later, you can look through all your photos to remember the journey.",
        commonMistakes: [
          "Forgetting to stage files with 'git add' before committing",
          "Writing vague commit messages like 'update' or 'changes'",
          "Trying to commit without initializing Git first",
          "Not including a commit message"
        ]
      },
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
          description: 'At least one commit was made with "initial" in the message',
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
      createdAt: createTimestamp(),
      updatedAt: createTimestamp(),
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
      createdAt: createTimestamp(),
      updatedAt: createTimestamp(),
    },
  }
}