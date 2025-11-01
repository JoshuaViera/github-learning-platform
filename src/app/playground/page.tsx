'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GitBranch, ArrowLeft, RotateCcw } from 'lucide-react'
import { Terminal } from '@/components/learning/Terminal'
import { CommandExecutor } from '@/lib/git-simulator/CommandExecutor'
import { getCurrentUser } from '@/lib/firebase/auth'
import Button from '@/components/ui/button'

export default function PlaygroundPage() {
  const router = useRouter()
  const [executor] = useState(() => new CommandExecutor())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }
    setLoading(false)
  }, [router])

  const handleCommand = async (command: string) => {
    const result = await executor.execute(command)
    
    if (result.output === 'CLEAR_TERMINAL') {
      return { output: '', type: 'output' as const }
    }
    
    return result
  }

  const handleReset = () => {
    executor.reset()
    window.location.reload()
  }

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
              <span className="text-xl font-bold text-gray-900">Git Playground</span>
            </div>
          </div>

          <Button onClick={handleReset} variant="outline" size="sm">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Terminal
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Practice Git Commands</h1>
          <p className="mt-2 text-gray-600">
            Try out Git commands in a safe, simulated environment. Type help to see available
            commands.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Terminal onCommand={handleCommand} />
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Reference</h2>
            
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Getting Started</h3>
                <code className="block rounded bg-gray-50 p-2 font-mono text-xs">
                  git init
                </code>
                <p className="mt-1 text-gray-600">Initialize a Git repository</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Making Changes</h3>
                <code className="block rounded bg-gray-50 p-2 font-mono text-xs">
                  touch file.txt<br />
                  git add file.txt<br />
                  git commit -m &quot;message&quot;
                </code>
                <p className="mt-1 text-gray-600">Create, stage, and commit a file</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Branching</h3>
                <code className="block rounded bg-gray-50 p-2 font-mono text-xs">
                  git branch feature<br />
                  git checkout feature
                </code>
                <p className="mt-1 text-gray-600">Create and switch to a new branch</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Viewing History</h3>
                <code className="block rounded bg-gray-50 p-2 font-mono text-xs">
                  git status<br />
                  git log
                </code>
                <p className="mt-1 text-gray-600">Check status and view commits</p>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <p className="text-xs text-blue-900">
                <strong>Pro tip:</strong> Use ↑ and ↓ arrow keys to navigate through your command
                history!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}