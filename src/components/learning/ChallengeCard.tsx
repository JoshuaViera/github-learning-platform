import Link from 'next/link'
import { Check, Lock, Clock } from 'lucide-react'
import { Challenge } from '@/types'
import { cn } from '@/lib/utils/cn'

interface ChallengeCardProps {
  challenge: Challenge
  isLocked?: boolean
  isCompleted?: boolean
  progress?: number
}

export function ChallengeCard({
  challenge,
  isLocked = false,
  isCompleted = false,
  progress = 0,
}: ChallengeCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  }

  const content = (
    <div
      className={cn(
        'group relative rounded-lg border-2 bg-white p-6 transition-all',
        isLocked
          ? 'border-gray-200 opacity-60'
          : isCompleted
          ? 'border-green-500'
          : 'border-gray-200 hover:border-primary-600 hover:shadow-lg'
      )}
    >
      {isCompleted && (
        <div className="absolute -right-2 -top-2 rounded-full bg-green-500 p-2">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}

      {isLocked && (
        <div className="absolute -right-2 -top-2 rounded-full bg-gray-400 p-2">
          <Lock className="h-4 w-4 text-white" />
        </div>
      )}

      <div className="mb-3">
        <span
          className={cn(
            'inline-block rounded-full px-3 py-1 text-xs font-semibold',
            difficultyColors[challenge.difficulty]
          )}
        >
          {challenge.difficulty}
        </span>
      </div>

      <h3 className="mb-2 text-lg font-semibold text-gray-900">{challenge.title}</h3>

      <p className="mb-4 line-clamp-2 text-sm text-gray-600">{challenge.description}</p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{challenge.estimatedTimeMinutes} min</span>
        </div>
        <div>
          <span className="font-medium">{challenge.points}</span> points
        </div>
      </div>

      {progress > 0 && progress < 100 && !isCompleted && (
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-primary-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )

  if (isLocked) {
    return content
  }

  return (
    <Link href={`/challenges/${challenge.id}`} className="block">
      {content}
    </Link>
  )
}