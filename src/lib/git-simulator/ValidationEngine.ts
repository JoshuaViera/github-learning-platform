// src/lib/git-simulator/ValidationEngine.ts
import { GitEngine } from './GitEngine'

export interface ValidationTest {
  id: string
  description: string
  gitCheck?: {
    type: 'status' | 'commit' | 'branch' | 'file' | 'merged'
    value: string | boolean
  }
}

export interface ValidationResult {
  testId: string
  passed: boolean
  message: string
}

export class ValidationEngine {
  private gitEngine: GitEngine

  constructor(gitEngine: GitEngine) {
    this.gitEngine = gitEngine
  }

  validateChallenge(tests: ValidationTest[]): ValidationResult[] {
    return tests.map((test) => this.runTest(test))
  }

  private runTest(test: ValidationTest): ValidationResult {
    if (!test.gitCheck) {
      return {
        testId: test.id,
        passed: false,
        message: `${test.description}: No validation criteria specified`,
      }
    }

    const { type, value } = test.gitCheck

    try {
      switch (type) {
        case 'status':
          return this.checkStatus(test, value)
        case 'commit':
          return this.checkCommit(test, value)
        case 'branch':
          return this.checkBranch(test, value)
        case 'file':
          return this.checkFile(test, value)
        case 'merged':
          return this.checkMerged(test, value)
        default:
          return {
            testId: test.id,
            passed: false,
            message: `${test.description}: Unknown test type`,
          }
      }
    } catch (error) {
      return {
        testId: test.id,
        passed: false,
        message: `${test.description}: Error running test - ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  private checkStatus(test: ValidationTest, value: string | boolean): ValidationResult {
    const state = this.gitEngine.getState()

    if (value === 'initialized' || value === true) {
      const isInitialized = state?.initialized === true
      return {
        testId: test.id,
        passed: isInitialized,
        message: isInitialized
          ? `✓ ${test.description}`
          : `✗ ${test.description} - Repository not initialized. Run 'git init' first.`,
      }
    }

    return {
      testId: test.id,
      passed: false,
      message: `✗ ${test.description} - Unknown status check`,
    }
  }

  private checkCommit(test: ValidationTest, value: string | boolean): ValidationResult {
    const state = this.gitEngine.getState()

    if (!state?.initialized) {
      return {
        testId: test.id,
        passed: false,
        message: `✗ ${test.description} - Repository not initialized`,
      }
    }

    const commits = state.commits || []

    if (typeof value === 'string') {
      // Check if any commit message contains the value (case-insensitive)
      const hasCommit = commits.some((commit) =>
        commit.message.toLowerCase().includes(value.toLowerCase())
      )

      return {
        testId: test.id,
        passed: hasCommit,
        message: hasCommit
          ? `✓ ${test.description}`
          : `✗ ${test.description} - No commit found with "${value}" in the message. Your commits: ${commits.map(c => `"${c.message}"`).join(', ') || 'none'}`,
      }
    }

    // Check if there are any commits
    const hasCommits = commits.length > 0
    return {
      testId: test.id,
      passed: hasCommits,
      message: hasCommits
        ? `✓ ${test.description}`
        : `✗ ${test.description} - No commits found. Use 'git commit -m "message"' to create a commit.`,
    }
  }

  private checkBranch(test: ValidationTest, value: string | boolean): ValidationResult {
    const state = this.gitEngine.getState()

    if (!state?.initialized) {
      return {
        testId: test.id,
        passed: false,
        message: `✗ ${test.description} - Repository not initialized`,
      }
    }

    const branches = state.branches || []

    if (typeof value === 'string') {
      // Check if branch exists (case-insensitive)
      const hasBranch = branches.some(
        (branch) => branch.toLowerCase() === value.toLowerCase()
      )

      return {
        testId: test.id,
        passed: hasBranch,
        message: hasBranch
          ? `✓ ${test.description}`
          : `✗ ${test.description} - Branch "${value}" not found. Available branches: ${branches.join(', ') || 'none'}`,
      }
    }

    // Check if there are multiple branches
    const hasMultipleBranches = branches.length > 1
    return {
      testId: test.id,
      passed: hasMultipleBranches,
      message: hasMultipleBranches
        ? `✓ ${test.description}`
        : `✗ ${test.description} - Only one branch exists`,
    }
  }

  private checkFile(test: ValidationTest, value: string | boolean): ValidationResult {
    const state = this.gitEngine.getState()

    if (!state?.initialized) {
      return {
        testId: test.id,
        passed: false,
        message: `✗ ${test.description} - Repository not initialized`,
      }
    }

    const workingDir = state.workingDirectory || []

    if (typeof value === 'string') {
      const hasFile = workingDir.includes(value)

      return {
        testId: test.id,
        passed: hasFile,
        message: hasFile
          ? `✓ ${test.description}`
          : `✗ ${test.description} - File "${value}" not found in working directory`,
      }
    }

    const hasFiles = workingDir.length > 0
    return {
      testId: test.id,
      passed: hasFiles,
      message: hasFiles
        ? `✓ ${test.description}`
        : `✗ ${test.description} - No files in working directory`,
    }
  }

  private checkMerged(test: ValidationTest, value: string | boolean): ValidationResult {
    const state = this.gitEngine.getState()

    if (!state?.initialized) {
      return {
        testId: test.id,
        passed: false,
        message: `✗ ${test.description} - Repository not initialized`,
      }
    }

    const commits = state.commits || []
    
    // Check if there are merge commits (commits with multiple parents)
    const hasMergeCommit = commits.some(
      (commit) => commit.parents && commit.parents.length > 1
    )

    return {
      testId: test.id,
      passed: hasMergeCommit || value === true,
      message: hasMergeCommit
        ? `✓ ${test.description}`
        : `✗ ${test.description} - No merge detected. Use 'git merge <branch>' to merge branches.`,
    }
  }

  allTestsPassed(results: ValidationResult[]): boolean {
    return results.every((result) => result.passed)
  }

  getFailedTests(results: ValidationResult[]): ValidationResult[] {
    return results.filter((result) => !result.passed)
  }
}