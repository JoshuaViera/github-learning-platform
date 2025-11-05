import { Timestamp } from 'firebase/firestore'

// ============================================================================
// USER TYPES
// ============================================================================

export type UserRole = 'student' | 'instructor' | 'admin'

export interface UserProfile {
  id: string
  email: string
  fullName: string
  avatarUrl: string
  role: UserRole
  pursuitCohort?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ============================================================================
// CHALLENGE TYPES
// ============================================================================

export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced'

export type ChallengeStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped'

export interface Challenge {
  id: string
  moduleId: string
  title: string
  description: string
  instructions: string
  orderIndex: number
  difficulty: ChallengeDifficulty
  estimatedTimeMinutes: number
  points: number

  // Challenge configuration
  startingFiles: FileNode[]
  expectedCommands: string[]
  validationTests: ValidationTest[]
  hints: Hint[]
  solution: Solution

  // Metadata
  tags: string[]
  prerequisites: string[] // Array of challenge IDs
  isPublished: boolean
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface FileNode {
  name: string
  type: 'file' | 'directory'
  content?: string
  children?: FileNode[]
}

export interface ValidationTest {
  id: string
  description: string
  command?: string
  fileCheck?: {
    path: string
    exists: boolean
    contains?: string
  }
  gitCheck?: {
    type: 'commit' | 'branch' | 'status'
    value: string
  }
}

export interface Hint {
  id: string
  level: number // Progressive hints: 1, 2, 3
  text: string
}

export interface Solution {
  commands: string[]
  explanation: string
}

// ============================================================================
// MODULE TYPES
// ============================================================================

export interface Module {
  id: string
  title: string
  description: string
  orderIndex: number
  estimatedTimeMinutes: number
  difficulty: ChallengeDifficulty
  isPublished: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ============================================================================
// PROGRESS TYPES
// ============================================================================

export interface UserProgress {
  id: string
  userId: string
  challengeId: string
  status: 'not-started' | 'in-progress' | 'completed' | 'in_progress'  // Added both variants
  startedAt?: Date
  completedAt?: Date
  attempts: number
  hintsUsed: number
  commandsExecuted: string[]
  timeSpentSeconds: number
  score?: number  // ← MAKE SURE THIS EXISTS
  solutionViewed?: boolean
  pointsEarned?: number
  savedTerminalState?: any
  createdAt?: Date
  updatedAt?: Date
}

export interface TerminalState {
  commandHistory: string[]
  fileSystem: FileNode[]
  currentDirectory: string
  gitState: GitState
}

export interface GitState {
  initialized: boolean
  currentBranch: string
  branches: string[]
  commits: Commit[]
  workingDirectory: string[]
  stagingArea: string[]
}

export interface Commit {
  hash: string
  parent: string | null
  message: string
  author: string
  timestamp: number
  files: FileNode[]
}

// ============================================================================
// ATTEMPT TYPES
// ============================================================================

export interface ChallengeAttempt {
  id: string
  userId: string
  challengeId: string
  submittedCommands: string[]
  testResults: TestResult[]
  isCorrect: boolean
  attemptedAt: Timestamp
}

export interface TestResult {
  testId: string
  passed: boolean
  message: string
}

// ============================================================================
// ACHIEVEMENT TYPES
// ============================================================================

export interface Achievement {
  id: string
  name: string
  description: string
  iconUrl: string
  criteria: {
    type: 'challenges_completed' | 'streak_days' | 'perfect_score' | 'speed_run'
    value: number
  }
  createdAt: Timestamp
}

export interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  earnedAt: Timestamp
}

// ============================================================================
// DAILY ACTIVITY TYPES
// ============================================================================

export interface DailyActivity {
  id: string
  userId: string
  activityDate: string // YYYY-MM-DD format
  challengesCompleted: number
  timeSpentSeconds: number
}

// ============================================================================
// CERTIFICATE TYPES
// ============================================================================

export interface Certificate {
  id: string
  userId: string
  moduleId: string
  certificateUrl: string
  issuedAt: Timestamp
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}