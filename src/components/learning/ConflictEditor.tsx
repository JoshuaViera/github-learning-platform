'use client'

// Rest of the file stays the same...
import { useState } from 'react'
// import { motion } from 'framer-motion'
import { AlertTriangle, Check, GitMerge } from 'lucide-react'
import { ConflictMarker, ConflictResolution } from '@/lib/git-simulator/ConflictResolver'
import { cn } from '@/lib/utils/cn'

interface ConflictEditorProps {
  conflicts: ConflictMarker[]
  onResolve: (resolution: ConflictResolution) => void
  className?: string
}

export function ConflictEditor({ conflicts, onResolve, className }: ConflictEditorProps) {
  const [currentConflictIndex, setCurrentConflictIndex] = useState(0)
  const [customContent, setCustomContent] = useState('')
  const [resolvedConflicts, setResolvedConflicts] = useState<Set<number>>(new Set())

  if (conflicts.length === 0) {
    return (
      <div className={cn('rounded-lg border border-green-200 bg-green-50 p-6 text-center', className)}>
        <Check className="mx-auto h-12 w-12 text-green-600" />
        <h3 className="mt-2 text-lg font-semibold text-green-900">All Conflicts Resolved!</h3>
        <p className="mt-1 text-sm text-green-700">You can now commit your changes</p>
      </div>
    )
  }

  const currentConflict = conflicts[currentConflictIndex]

  const handleResolve = (strategy: 'accept-current' | 'accept-incoming' | 'accept-both' | 'custom') => {
    const resolution: ConflictResolution = {
      file: currentConflict.file,
      resolvedContent: strategy === 'custom' ? customContent : '',
      resolution: strategy,
    }

    onResolve(resolution)
    setResolvedConflicts((prev) => new Set([...prev, currentConflictIndex]))

    // Move to next conflict
    if (currentConflictIndex < conflicts.length - 1) {
      setCurrentConflictIndex(currentConflictIndex + 1)
      setCustomContent('')
    }
  }

  return (
    <div className={cn('rounded-lg border bg-white', className)}>
      {/* Header */}
      <div className="border-b bg-red-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Merge Conflict Detected</h3>
              <p className="text-sm text-red-700">
                Conflict {currentConflictIndex + 1} of {conflicts.length} in {currentConflict.file}
              </p>
            </div>
          </div>
          <div className="text-sm text-red-700">
            {resolvedConflicts.size} / {conflicts.length} resolved
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pt-4">
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-green-500 transition-all duration-300"
            style={{ width: `${(resolvedConflicts.size / conflicts.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Conflict Content */}
      <div className="p-4">
        <div className="space-y-4">
          {/* Current (HEAD) */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                CURRENT (HEAD)
              </div>
              <span className="text-xs text-blue-700">Your changes</span>
            </div>
            <pre className="overflow-x-auto rounded bg-blue-100 p-3 font-mono text-sm text-blue-900">
              {currentConflict.currentContent || '(empty)'}
            </pre>
          </div>

          {/* Separator */}
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-300" />
            <GitMerge className="h-4 w-4 text-gray-400" />
            <div className="h-px flex-1 bg-gray-300" />
          </div>

          {/* Incoming */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded bg-green-600 px-2 py-0.5 text-xs font-bold text-white">
                INCOMING
              </div>
              <span className="text-xs text-green-700">Their changes</span>
            </div>
            <pre className="overflow-x-auto rounded bg-green-100 p-3 font-mono text-sm text-green-900">
              {currentConflict.incomingContent || '(empty)'}
            </pre>
          </div>
        </div>

        {/* Resolution Options */}
        <div className="mt-6 space-y-3">
          <h4 className="font-semibold text-gray-900">Choose Resolution:</h4>

          <div className="grid gap-2 sm:grid-cols-3">
            <button
              onClick={() => handleResolve('accept-current')}
              className="rounded-lg border-2 border-blue-200 bg-blue-50 p-3 text-left transition-all hover:border-blue-400 hover:bg-blue-100"
            >
              <div className="font-semibold text-blue-900">Accept Current</div>
              <div className="text-xs text-blue-700">Keep your changes</div>
            </button>

            <button
              onClick={() => handleResolve('accept-incoming')}
              className="rounded-lg border-2 border-green-200 bg-green-50 p-3 text-left transition-all hover:border-green-400 hover:bg-green-100"
            >
              <div className="font-semibold text-green-900">Accept Incoming</div>
              <div className="text-xs text-green-700">Use their changes</div>
            </button>

            <button
              onClick={() => handleResolve('accept-both')}
              className="rounded-lg border-2 border-purple-200 bg-purple-50 p-3 text-left transition-all hover:border-purple-400 hover:bg-purple-100"
            >
              <div className="font-semibold text-purple-900">Accept Both</div>
              <div className="text-xs text-purple-700">Keep both versions</div>
            </button>
          </div>

          {/* Custom Resolution */}
          <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
            <label className="mb-2 block font-semibold text-gray-900">Custom Resolution:</label>
            <textarea
              value={customContent}
              onChange={(e) => setCustomContent(e.target.value)}
              placeholder="Write your custom resolution here..."
              className="w-full rounded border border-gray-300 p-3 font-mono text-sm focus:border-primary-500 focus:outline-none"
              rows={4}
            />
            <button
              onClick={() => handleResolve('custom')}
              disabled={!customContent.trim()}
              className="mt-2 flex items-center gap-2 rounded bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              Use Custom Resolution
            </button>
          </div>
        </div>

        {/* Navigation */}
        {conflicts.length > 1 && (
          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <button
              onClick={() => setCurrentConflictIndex(Math.max(0, currentConflictIndex - 1))}
              disabled={currentConflictIndex === 0}
              className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-30"
            >
              ← Previous Conflict
            </button>
            <button
              onClick={() =>
                setCurrentConflictIndex(Math.min(conflicts.length - 1, currentConflictIndex + 1))
              }
              disabled={currentConflictIndex === conflicts.length - 1}
              className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-30"
            >
              Next Conflict →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}