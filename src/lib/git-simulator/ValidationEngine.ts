import { GitEngine } from './GitEngine'
import { ValidationTest } from '@/types'

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
    try {
      if (test.command) {
        return this.validateCommand(test)
      }

      if (test.fileCheck) {
        return this.validateFile(test)
      }

      if (test.gitCheck) {
        return this.validateGitState(test)
      }

      return {
        testId: test.id,
        passed: false,
        message: 'Invalid test configuration',
      }
    } catch (error) {
      return {
        testId: test.id,
        passed: false,
        message: `Test error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  private validateCommand(test: ValidationTest): ValidationResult {
    return {
      testId: test.id,
      passed: true,
      message: test.description,
    }
  }

  private validateFile(test: ValidationTest): ValidationResult {
    if (!test.fileCheck) {
      return {
        testId: test.id,
        passed: false,
        message: 'No file check specified',
      }
    }

    const state = this.gitEngine.getState()
    const fileExists =
      state.workingDirectory.includes(test.fileCheck.path) ||
      state.stagingArea.includes(test.fileCheck.path)

    if (test.fileCheck.exists && !fileExists) {
      return {
        testId: test.id,
        passed: false,
        message: `File ${test.fileCheck.path} does not exist`,
      }
    }

    if (!test.fileCheck.exists && fileExists) {
      return {
        testId: test.id,
        passed: false,
        message: `File ${test.fileCheck.path} should not exist`,
      }
    }

    return {
      testId: test.id,
      passed: true,
      message: test.description,
    }
  }

  private validateGitState(test: ValidationTest): ValidationResult {
    if (!test.gitCheck) {
      return {
        testId: test.id,
        passed: false,
        message: 'No git check specified',
      }
    }

    const state = this.gitEngine.getState()

    switch (test.gitCheck.type) {
      case 'commit':
        const hasCommit = state.commits.some((commit) =>
          commit.message.toLowerCase().includes(test.gitCheck!.value.toLowerCase())
        )
        return {
          testId: test.id,
          passed: hasCommit,
          message: hasCommit
            ? test.description
            : `No commit found with message containing "${test.gitCheck.value}"`,
        }

      case 'branch':
        const hasBranch = state.branches.includes(test.gitCheck.value)
        return {
          testId: test.id,
          passed: hasBranch,
          message: hasBranch
            ? test.description
            : `Branch "${test.gitCheck.value}" does not exist`,
        }

      case 'status':
        const isInitialized = state.initialized
        if (test.gitCheck.value === 'initialized') {
          return {
            testId: test.id,
            passed: isInitialized,
            message: isInitialized
              ? test.description
              : 'Git repository is not initialized',
          }
        }
        return {
          testId: test.id,
          passed: false,
          message: 'Unknown status check',
        }

      default:
        return {
          testId: test.id,
          passed: false,
          message: 'Unknown git check type',
        }
    }
  }

  allTestsPassed(results: ValidationResult[]): boolean {
    return results.every((result) => result.passed)
  }

  getFailedTests(results: ValidationResult[]): ValidationResult[] {
    return results.filter((result) => !result.passed)
  }
}