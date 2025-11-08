// src/lib/git-simulator/GitEngine.ts
export interface GitState {
  initialized: boolean
  currentBranch: string
  branches: string[]
  commits: Array<{
    hash: string
    message: string
    author: string
    timestamp: number
    parents?: string[]
  }>
  workingDirectory: string[]
  stagingArea: string[]
  head: string
}

export class GitEngine {
  private state: GitState = {
    initialized: false,
    currentBranch: 'main',
    branches: [],
    commits: [],
    workingDirectory: [],
    stagingArea: [],
    head: '',
  }

  init(): string {
    if (this.state.initialized) {
      return 'Reinitialized existing Git repository in .git/'
    }

    this.state.initialized = true
    this.state.branches = ['main']
    this.state.currentBranch = 'main'
    
    return 'Initialized empty Git repository in .git/'
  }

  status(): string {
    if (!this.state.initialized) {
      return 'fatal: not a git repository (or any of the parent directories): .git'
    }

    const lines: string[] = []
    lines.push(`On branch ${this.state.currentBranch}`)
    
    if (this.state.commits.length === 0) {
      lines.push('\nNo commits yet')
    }

    if (this.state.stagingArea.length > 0) {
      lines.push('\nChanges to be committed:')
      lines.push('  (use "git restore --staged <file>..." to unstage)')
      this.state.stagingArea.forEach((file) => {
        lines.push(`\tnew file:   ${file}`)
      })
    }

    const unstagedFiles = this.state.workingDirectory.filter(
      (file) => !this.state.stagingArea.includes(file)
    )

    if (unstagedFiles.length > 0) {
      lines.push('\nUntracked files:')
      lines.push('  (use "git add <file>..." to include in what will be committed)')
      unstagedFiles.forEach((file) => {
        lines.push(`\t${file}`)
      })
    }

    if (this.state.stagingArea.length === 0 && unstagedFiles.length === 0) {
      lines.push('\nnothing to commit, working tree clean')
    }

    return lines.join('\n')
  }

  add(filename: string): string {
    if (!this.state.initialized) {
      return 'fatal: not a git repository (or any of the parent directories): .git'
    }

    if (!this.state.workingDirectory.includes(filename)) {
      return `fatal: pathspec '${filename}' did not match any files`
    }

    if (!this.state.stagingArea.includes(filename)) {
      this.state.stagingArea.push(filename)
    }

    return ''
  }

  commit(message: string): string {
    if (!this.state.initialized) {
      return 'fatal: not a git repository (or any of the parent directories): .git'
    }

    if (this.state.stagingArea.length === 0) {
      return 'nothing to commit, working tree clean'
    }

    const hash = this.generateHash()
    const commit = {
      hash,
      message: message || 'No commit message',
      author: 'Student',
      timestamp: Date.now(),
      parents: this.state.head ? [this.state.head] : [],
    }

    this.state.commits.push(commit)
    this.state.head = hash
    this.state.stagingArea = []

    const filesCommitted = this.state.stagingArea.length
    return `[${this.state.currentBranch} ${hash.substring(0, 7)}] ${message}\n ${filesCommitted} file${filesCommitted !== 1 ? 's' : ''} changed`
  }

  branch(branchName?: string): string {
    if (!this.state.initialized) {
      return 'fatal: not a git repository (or any of the parent directories): .git'
    }

    if (!branchName) {
      // List branches
      return this.state.branches
        .map((b) => (b === this.state.currentBranch ? `* ${b}` : `  ${b}`))
        .join('\n')
    }

    if (this.state.branches.includes(branchName)) {
      return `fatal: A branch named '${branchName}' already exists.`
    }

    this.state.branches.push(branchName)
    return ``
  }

  checkout(branchName: string): string {
    if (!this.state.initialized) {
      return 'fatal: not a git repository (or any of the parent directories): .git'
    }

    // Check if it's a branch creation flag
    if (branchName === '-b') {
      return `error: switch 'b' requires a value`
    }

    if (!this.state.branches.includes(branchName)) {
      return `error: pathspec '${branchName}' did not match any file(s) known to git`
    }

    this.state.currentBranch = branchName
    return `Switched to branch '${branchName}'`
  }

  checkoutNewBranch(branchName: string): string {
    if (!this.state.initialized) {
      return 'fatal: not a git repository (or any of the parent directories): .git'
    }

    if (this.state.branches.includes(branchName)) {
      return `fatal: A branch named '${branchName}' already exists.`
    }

    this.state.branches.push(branchName)
    this.state.currentBranch = branchName
    return `Switched to a new branch '${branchName}'`
  }

  log(): string {
    if (!this.state.initialized) {
      return 'fatal: not a git repository (or any of the parent directories): .git'
    }

    if (this.state.commits.length === 0) {
      return 'fatal: your current branch does not have any commits yet'
    }

    return this.state.commits
      .reverse()
      .map((commit) => {
        return `commit ${commit.hash}\nAuthor: ${commit.author}\nDate: ${new Date(commit.timestamp).toLocaleString()}\n\n    ${commit.message}\n`
      })
      .join('\n')
  }

  merge(branchName: string): string {
    if (!this.state.initialized) {
      return 'fatal: not a git repository (or any of the parent directories): .git'
    }

    if (!this.state.branches.includes(branchName)) {
      return `fatal: '${branchName}' does not refer to a commit`
    }

    if (branchName === this.state.currentBranch) {
      return `fatal: Cannot merge branch into itself`
    }

    // Simulate successful merge
    const hash = this.generateHash()
    const commit = {
      hash,
      message: `Merge branch '${branchName}'`,
      author: 'Student',
      timestamp: Date.now(),
      parents: [this.state.head, hash],
    }

    this.state.commits.push(commit)
    this.state.head = hash

    return `Merge made by the 'recursive' strategy.`
  }

  createFile(filename: string, _content?: string): string {
    if (!this.state.workingDirectory.includes(filename)) {
      this.state.workingDirectory.push(filename)
    }
    return ''
  }

  getState(): GitState {
    return { ...this.state }
  }

  reset(): void {
    this.state = {
      initialized: false,
      currentBranch: 'main',
      branches: [],
      commits: [],
      workingDirectory: [],
      stagingArea: [],
      head: '',
    }
  }

  private generateHash(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }
}