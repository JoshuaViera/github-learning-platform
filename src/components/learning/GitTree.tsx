'use client'

import { useEffect, useRef } from 'react'
import { GitBranch, GitCommit } from 'lucide-react'

interface CommitNode {
  hash: string
  message: string
  author: string
  timestamp: number | string | Date
  branches: string[]
  parent?: string
}

interface BranchNode {
  name: string
  commit: string
  isHead: boolean
}

interface VisualTree {
  commits: CommitNode[]
  branches: BranchNode[]
  head: string
}

interface GitTreeProps {
  tree: VisualTree
  className?: string
}

export function GitTree({ tree, className }: GitTreeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Helper function to safely format timestamp
  const formatTimestamp = (timestamp: number | string | Date): string => {
    try {
      if (typeof timestamp === 'number') {
        return new Date(timestamp).toLocaleTimeString()
      } else if (timestamp instanceof Date) {
        return timestamp.toLocaleTimeString()
      } else if (typeof timestamp === 'string') {
        return new Date(timestamp).toLocaleTimeString()
      }
      return 'Unknown'
    } catch {
      return 'Unknown'
    }
  }

  useEffect(() => {
    if (!canvasRef.current || !tree.commits.length) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = Math.max(tree.commits.length * 80 + 100, 300)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw commit graph
    const commitPositions = new Map<string, { x: number; y: number }>()
    const startX = 50
    const startY = 50

    tree.commits.forEach((commit, index) => {
      const x = startX + index * 100
      const y = startY

      commitPositions.set(commit.hash, { x, y })

      // Draw commit circle
      ctx.beginPath()
      ctx.arc(x, y, 20, 0, 2 * Math.PI)
      ctx.fillStyle = commit.branches.includes('HEAD') ? '#10b981' : '#3b82f6'
      ctx.fill()
      ctx.strokeStyle = '#1e293b'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw hash
      ctx.fillStyle = '#1e293b'
      ctx.font = '12px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(commit.hash.substring(0, 7), x, y + 40)
    })

    // Draw lines between commits
    tree.commits.forEach((commit) => {
      if (commit.parent) {
        const childPos = commitPositions.get(commit.hash)
        const parentPos = commitPositions.get(commit.parent)

        if (childPos && parentPos) {
          ctx.beginPath()
          ctx.moveTo(childPos.x, childPos.y)
          ctx.lineTo(parentPos.x, parentPos.y)
          ctx.strokeStyle = '#94a3b8'
          ctx.lineWidth = 2
          ctx.stroke()
        }
      }
    })
  }, [tree])

  if (!tree.commits || tree.commits.length === 0) {
    return (
      <div className={`rounded-lg border bg-white p-8 text-center ${className || ''}`}>
        <GitBranch className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-600">No commits yet</p>
        <p className="mt-1 text-sm text-gray-500">Make your first commit to see the tree!</p>
      </div>
    )
  }

  return (
    <div className={`rounded-lg border bg-white ${className || ''}`}>
      {/* Header */}
      <div className="border-b bg-gray-50 p-4">
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">Git Tree Visualization</h3>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          {tree.commits.length} commit{tree.commits.length !== 1 ? 's' : ''} •{' '}
          {tree.branches.length} branch{tree.branches.length !== 1 ? 'es' : ''}
        </p>
      </div>

      {/* Canvas */}
      <div className="p-4">
        <canvas ref={canvasRef} className="w-full" />
      </div>

      {/* Branches */}
      {tree.branches.length > 0 && (
        <div className="border-t p-4">
          <h4 className="mb-3 text-sm font-semibold text-gray-900">Branches</h4>
          <div className="flex flex-wrap gap-2">
            {tree.branches.map((branch) => (
              <div
                key={branch.name}
                className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
                  branch.isHead
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                <GitBranch className="h-3 w-3" />
                <span className="font-medium">{branch.name}</span>
                {branch.isHead && <span className="text-xs">(HEAD)</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Commit List */}
      <div className="border-t">
        <div className="max-h-96 overflow-y-auto">
          {tree.commits.map((commit) => (
            <div
              key={commit.hash}
              className="border-b p-4 last:border-0 hover:bg-gray-50"
            >
              <div className="flex items-start gap-3">
                <GitCommit className="mt-1 h-4 w-4 flex-shrink-0 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-gray-600">
                      {commit.hash.substring(0, 7)}
                    </code>
                    {commit.branches.map((branch) => (
                      <span
                        key={branch}
                        className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                      >
                        {branch}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1 font-medium text-gray-900">{commit.message}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                    <span>{commit.author}</span>
                    <span>•</span>
                    <span>{formatTimestamp(commit.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}