'use client'

import { Play, Pause, SkipBack, SkipForward, RotateCcw, FastForward } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface PlaybackControlsProps {
  isPlaying: boolean
  canGoBack: boolean
  canGoForward: boolean
  currentIndex: number
  totalSteps: number
  playbackSpeed?: number
  onPlay: () => void
  onPause: () => void
  onStepBack: () => void
  onStepForward: () => void
  onReset: () => void
  onSpeedChange?: (speed: number) => void
  className?: string
}

export function PlaybackControls({
  isPlaying,
  canGoBack,
  canGoForward,
  currentIndex,
  totalSteps,
  playbackSpeed = 1,
  onPlay,
  onPause,
  onStepBack,
  onStepForward,
  onReset,
  onSpeedChange,
  className,
}: PlaybackControlsProps) {
  const speeds = [0.5, 1, 1.5, 2]

  return (
    <div className={cn('rounded-lg border bg-white p-4', className)}>
      <div className="flex items-center justify-between">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="rounded p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
            title="Reset to start"
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          <button
            onClick={onStepBack}
            disabled={!canGoBack}
            className="rounded p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
            title="Step back"
          >
            <SkipBack className="h-5 w-5" />
          </button>

          {isPlaying ? (
            <button
              onClick={onPause}
              className="rounded-full bg-primary-600 p-3 text-white hover:bg-primary-700"
              title="Pause"
            >
              <Pause className="h-6 w-6" />
            </button>
          ) : (
            <button
              onClick={onPlay}
              className="rounded-full bg-primary-600 p-3 text-white hover:bg-primary-700"
              title="Play"
            >
              <Play className="h-6 w-6" />
            </button>
          )}

          <button
            onClick={onStepForward}
            disabled={!canGoForward}
            className="rounded p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
            title="Step forward"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Info */}
        <div className="text-sm text-gray-600">
          Step {currentIndex + 1} / {totalSteps}
        </div>

        {/* Speed Control */}
        {onSpeedChange && (
          <div className="flex items-center gap-2">
            <FastForward className="h-4 w-4 text-gray-400" />
            <select
              value={playbackSpeed}
              onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
              className="rounded border border-gray-300 px-2 py-1 text-sm"
            >
              {speeds.map((speed) => (
                <option key={speed} value={speed}>
                  {speed}x
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-primary-600 transition-all duration-300"
            style={{
              width: `${totalSteps > 0 ? ((currentIndex + 1) / totalSteps) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}