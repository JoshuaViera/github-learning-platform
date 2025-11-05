import { cn } from '@/lib/utils/cn'

interface DifficultyBadgeProps {
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  className?: string
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const config = {
    beginner: {
      label: 'Beginner',
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: '📗',
    },
    intermediate: {
      label: 'Intermediate',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: '📘',
    },
    advanced: {
      label: 'Advanced',
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      icon: '📕',
    },
  }

  const { label, color, icon } = config[difficulty]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        color,
        className
      )}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  )
}