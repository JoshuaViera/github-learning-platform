'use client'

import Link from 'next/link'
import { Lock, CheckCircle, Clock, Star } from 'lucide-react'
import { Challenge } from '@/types'
import { DifficultyBadge } from './DifficultyBadge'
import { CategoryBadge } from './CategoryBadge'
import { cn } from '@/lib/utils/cn'

interface ChallengeCardProps {
  challenge: Challenge
  isLocked?: boolean
  isCompleted?: boolean
  score?: number
}

export function ChallengeCard({
  challenge,
  isLocked = false,
  isCompleted = false,
  score,
}: ChallengeCardProps) {
  const CardContent = (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-white p-6 shadow-sm transition-all',
        {
          'hover:shadow-md hover:border-primary-300 cursor-pointer': !isLocked,
          'opacity-60 cursor-not-allowed': isLocked,
          'border-green-200 bg-green-50': isCompleted,
        }
      )}
    >
      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 backdrop-blur-sm">
          <div className="rounded-full bg-white p-3 shadow-lg">
            <Lock className="h-6 w-6 text-gray-400" />
          </div>
        </div>
      )}

      {/* Completed Badge */}
      {isCompleted && (
        <div className="absolute right-4 top-4">
          <div className="flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
            <CheckCircle className="h-3 w-3" />
            <span>Completed</span>
          </div>
        </div>
      )}

      {/* Challenge Content */}
      <div>
        <h3
          className={cn('text-lg font-semibold text-gray-900 group-hover:text-primary-600', {
            'text-green-700': isCompleted,
          })}
        >
          {challenge.title}
        </h3>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{challenge.description}</p>

        {/* Badges */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={challenge.difficulty} />
          {challenge.tags && challenge.tags.slice(0, 2).map((tag) => (
            <CategoryBadge key={tag} category={tag} />
          ))}
        </div>

        {/* Meta Info */}
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {challenge.estimatedTimeMinutes && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{challenge.estimatedTimeMinutes}min</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-medium text-gray-900">{challenge.points}</span>
            </div>
          </div>

          {/* Score */}
          {isCompleted && score !== undefined && (
            <div className="flex items-center gap-1 text-sm">
              <span className="text-gray-600">Score:</span>
              <span className="font-bold text-green-600">{score}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      {!isLocked && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-50 to-blue-50 opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </div>
  )

  if (isLocked) {
    return CardContent
  }

  return <Link href={`/challenges/${challenge.id}`}>{CardContent}</Link>
}