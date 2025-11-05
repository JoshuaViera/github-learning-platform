'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  History,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Download,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { CommandRecord } from '@/lib/git-simulator/CommandRecorder'
import { cn } from '@/lib/utils/cn'

interface CommandHistoryProps {
  history: CommandRecord[]
  currentIndex: number
  onJumpTo?: (index: number) => void
  onPlayPause?: () => void
  onStepBack?: () => void
  onStepForward?: () => void
  onReset?: () => void
  onExport?: () => void
  isPlaying?: boolean
  className?: string
}

export function CommandHistory({
  history,
  currentIndex,
  onJumpTo,
  onPlayPause,
  onStepBack,
  onStepForward,
  onReset,
  onExport,
  isPlaying = false,
  className,
}: CommandHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState<CommandRecord | null>(null)

  const successRate =
    history.length > 0
      ? (history.filter((r) => r.success).length / history.length) * 100
      : 0

  return (
    <div className={cn('rounded-lg border bg-white', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <History className="h-5 w-5 text-primary-600" />
          <div>
            <h3 className="font-semibold text-gray-900">Command History</h3>
            <p className="text-xs text-gray-500">
              {history.length} commands • {successRate.toFixed(0)}% success rate
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onExport && (
            <button
              onClick={onExport}
              className="rounded p-2 text-gray-600 hover:bg-gray-100"
              title="Export as script"
            >
              <Download className="h-4 w-4" />
            </button>
          )}
          {onReset && (
            <button
              onClick={onReset}
              className="rounded p-2 text-gray-600 hover:bg-gray-100"
              title="Reset history"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded p-2 text-gray-600 hover:bg-gray-100"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Playback Controls */}
            <div className="border-b bg-gray-50 p-3">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={onStepBack}
                  disabled={currentIndex <= 0}
                  className="rounded p-2 text-gray-600 hover:bg-white disabled:opacity-30"
                  title="Step back"
                >
                  <SkipBack className="h-4 w-4" />
                </button>
                <button
                  onClick={onPlayPause}
                  className="rounded-full bg-primary-600 p-3 text-white hover:bg-primary-700"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                <button
                  onClick={onStepForward}
                  disabled={currentIndex >= history.length - 1}
                  className="rounded p-2 text-gray-600 hover:bg-white disabled:opacity-30"
                  title="Step forward"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3">
                <div className="h-1 w-full rounded-full bg-gray-200">
                  <div
                    className="h-1 rounded-full bg-primary-600 transition-all"
                    style={{
                      width: `${history.length > 0 ? ((currentIndex + 1) / history.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div className="mt-1 text-center text-xs text-gray-500">
                  Command {currentIndex + 1} of {history.length}
                </div>
              </div>
            </div>

            {/* Command List */}
            <div className="max-h-96 overflow-y-auto p-3">
              {history.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <History className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2">No commands yet</p>
                  <p className="mt-1 text-sm">Start typing Git commands to see history</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        setSelectedRecord(record)
                        onJumpTo?.(index)
                      }}
                      className={cn(
                        'cursor-pointer rounded-lg border p-3 transition-all hover:shadow-md',
                        {
                          'border-primary-600 bg-primary-50': index === currentIndex,
                          'border-gray-200 bg-white': index !== currentIndex,
                        }
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          {record.success ? (
                            <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                          )}
                          <div>
                            <code className="text-sm font-mono text-gray-900">
                              {record.command}
                            </code>
                            <p className="mt-1 text-xs text-gray-500">
                              {record.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-gray-400">#{index + 1}</span>
                      </div>
                      {selectedRecord?.id === record.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="mt-3 rounded border-t bg-gray-50 p-2 text-xs"
                        >
                          <div className="font-mono text-gray-700">{record.output}</div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}