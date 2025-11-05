import { Code, GitBranch, Users, Zap } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface CategoryBadgeProps {
  category: string
  className?: string
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const config: Record<string, { icon: React.ReactNode; color: string }> = {
    commands: {
      icon: <Code className="h-3 w-3" />,
      color: 'bg-gray-100 text-gray-700',
    },
    branching: {
      icon: <GitBranch className="h-3 w-3" />,
      color: 'bg-green-100 text-green-700',
    },
    collaboration: {
      icon: <Users className="h-3 w-3" />,
      color: 'bg-blue-100 text-blue-700',
    },
    advanced: {
      icon: <Zap className="h-3 w-3" />,
      color: 'bg-purple-100 text-purple-700',
    },
  }

  const { icon, color } = config[category.toLowerCase()] || config.commands

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        color,
        className
      )}
    >
      {icon}
      <span className="capitalize">{category}</span>
    </span>
  )
}