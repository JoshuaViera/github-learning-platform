export interface Module {
  id: string
  title: string
  description: string
  icon: string
  color: string
  totalChallenges: number
  totalPoints: number
  order: number
  prerequisites: string[]
}

export const modules: Module[] = [
  {
    id: 'git-basics',
    title: 'Git Basics',
    description: 'Master fundamental Git commands and concepts',
    icon: '📚',
    color: 'bg-blue-500',
    totalChallenges: 7,
    totalPoints: 105,
    order: 1,
    prerequisites: [],
  },
  {
    id: 'git-branching',
    title: 'Branching & Workflows',
    description: 'Learn to work with branches effectively',
    icon: '🌿',
    color: 'bg-green-500',
    totalChallenges: 6,
    totalPoints: 120,
    order: 2,
    prerequisites: ['git-basics'],
  },
  {
    id: 'git-merging',
    title: 'Merging Strategies',
    description: 'Combine work from different branches',
    icon: '🔀',
    color: 'bg-purple-500',
    totalChallenges: 3,
    totalPoints: 90,
    order: 3,
    prerequisites: ['git-branching'],
  },
  {
    id: 'git-remotes',
    title: 'Remote Repositories',
    description: 'Collaborate using GitHub and remote repos',
    icon: '☁️',
    color: 'bg-cyan-500',
    totalChallenges: 5,
    totalPoints: 105,
    order: 4,
    prerequisites: ['git-basics'],
  },
  {
    id: 'git-advanced',
    title: 'Advanced Techniques',
    description: 'Master stashing, tagging, and more',
    icon: '⚡',
    color: 'bg-yellow-500',
    totalChallenges: 2,
    totalPoints: 45,
    order: 5,
    prerequisites: ['git-remotes'],
  },
  {
    id: 'git-capstone',
    title: 'Capstone Project',
    description: 'Complete real-world Git workflow',
    icon: '🏆',
    color: 'bg-red-500',
    totalChallenges: 1,
    totalPoints: 40,
    order: 6,
    prerequisites: ['git-basics', 'git-branching', 'git-merging', 'git-remotes'],
  },
]