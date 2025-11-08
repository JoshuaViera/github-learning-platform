// src/lib/git-simulator/ErrorHandler.ts
export interface GitError {
  type: 'syntax' | 'semantic' | 'state' | 'suggestion'
  message: string
  suggestion?: string
  expectedCommand?: string
  userCommand: string
}

export class GitErrorHandler {
  private commonMistakes: Record<string, string> = {
    'git innit': 'git init',
    'git comit': 'git commit',
    'git checkut': 'git checkout',
    'git brach': 'git branch',
    'git statsu': 'git status',
    'git pul': 'git pull',
    'git puhs': 'git push',
    'git ad': 'git add',
    'git rmeote': 'git remote',
    'git mege': 'git merge',
  }

  private commandSuggestions: Record<string, string[]> = {
    init: ['git init'],
    commit: ['git add <file>', 'git commit -m "message"'],
    branch: ['git branch <name>', 'git checkout -b <name>'],
    checkout: ['git checkout <branch>', 'git checkout -b <new-branch>'],
    merge: ['git merge <branch>'],
    push: ['git push origin <branch>'],
    pull: ['git pull origin <branch>'],
  }

  checkCommand(userInput: string, validCommands: string[]): GitError | null {
    const trimmed = userInput.trim()

    // Empty command
    if (!trimmed) {
      return {
        type: 'syntax',
        message: 'No command entered',
        suggestion: 'Try typing a Git command like "git status"',
        userCommand: trimmed,
      }
    }

    // Not a Git command
    if (!trimmed.startsWith('git ') && !['touch', 'echo', 'cd', 'ls'].includes(trimmed.split(' ')[0])) {
      return {
        type: 'semantic',
        message: 'Unknown command',
        suggestion: `Did you forget to start with "git"?`,
        userCommand: trimmed,
      }
    }

    // Common typos
    for (const [typo, correct] of Object.entries(this.commonMistakes)) {
      if (trimmed.toLowerCase().startsWith(typo)) {
        return {
          type: 'syntax',
          message: `Command not recognized: "${typo}"`,
          suggestion: `Did you mean "${correct}"?`,
          expectedCommand: correct,
          userCommand: trimmed,
        }
      }
    }

    // Invalid Git subcommand
    const parts = trimmed.split(' ')
    if (parts[0] === 'git' && parts[1]) {
      const subcommand = parts[1]
      const validSubcommands = ['init', 'add', 'commit', 'status', 'log', 'branch', 'checkout', 'merge', 'push', 'pull', 'clone', 'remote', 'fetch', 'stash', 'tag', 'restore']
      
      if (!validSubcommands.includes(subcommand)) {
        const similar = this.findSimilarCommand(subcommand, validSubcommands)
        return {
          type: 'semantic',
          message: `git: '${subcommand}' is not a git command`,
          suggestion: similar ? `Did you mean "git ${similar}"?` : 'See "git --help" for available commands',
          expectedCommand: similar ? `git ${similar}` : undefined,
          userCommand: trimmed,
        }
      }
    }

    return null
  }

  provideHint(failedCommand: string, expectedCommands: string[]): string {
    const parts = failedCommand.trim().split(' ')
    const subcommand = parts[1]

    if (subcommand && this.commandSuggestions[subcommand]) {
      return `Try one of these: ${this.commandSuggestions[subcommand].join(', ')}`
    }

    if (expectedCommands.length > 0) {
      return `Expected commands include: ${expectedCommands.slice(0, 3).join(', ')}`
    }

    return 'Check the challenge instructions for the correct commands'
  }

  private findSimilarCommand(input: string, validCommands: string[]): string | null {
    // Simple Levenshtein distance check
    let minDistance = Infinity
    let closestMatch: string | null = null

    for (const cmd of validCommands) {
      const distance = this.levenshteinDistance(input, cmd)
      if (distance < minDistance && distance <= 2) {
        minDistance = distance
        closestMatch = cmd
      }
    }

    return closestMatch
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }

    return matrix[str2.length][str1.length]
  }
}