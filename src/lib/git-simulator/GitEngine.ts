import { FileNode, GitState, Commit } from '@/types'

export class GitEngine {
  private state: GitState
  private workingDirectory: Map<string, string> // path -> content

  constructor() {
    this.state = {
      initialized: false,
      currentBranch: 'main',
      branches: [],
      commits: [],
      workingDirectory: [],
      stagingArea: [],
    }
    this.workingDirectory = new Map()
  }

  // Initialize a Git repository
  init(): string {
    if (this.state.initialized) {
      return 'Reinitialized existing Git repository'
    }

    this.state.initialized = true
    this.state.branches = ['main']
    this.state.currentBranch = 'main'

    return 'Initialized empty Git repository'
  }

  // Check Git status
  status(): string {
    if (!this.state.initialized) {
      return 'fatal: not a git repository (or any of the parent directories)'
    }

    let output = `On branch ${this.state.currentBranch}\n\n`

    if (this.state.commits.length === 0) {
      output += 'No commits yet\n\n'
    }

    // Check for changes to be committed (staging area)
    if (this.state.stagingArea.length > 0) {
      output += 'Changes to be committed:\n'
      output += '  (use "git restore --staged <file>..." to unstage)\n'
      this.state.stagingArea.forEach((file) => {
        output += `\tmodified:   ${file}\n`
      })
      output += '\n'
    }

    // Check for changes not staged for commit (working directory)
    if (this.state.workingDirectory.length > 0 && this.state.stagingArea.length === 0) {
      output += 'Changes not staged for commit:\n'
      output += '  (use "git add <file>..." to update what will be committed)\n'
      this.state.workingDirectory.forEach((file) => {
        output += `\tmodified:   ${file}\n`
      })
      output += '\n'
    }

    if (
      this.state.stagingArea.length === 0 &&
      this.state.workingDirectory.length === 0 &&
      this.state.commits.length > 0
    ) {
      output += 'nothing to commit, working tree clean'
    }

    return output.trim()
  }

  // Add files to staging area
  add(files: string[]): string {
    if (!this.state.initialized) {
      return 'fatal: not a git repository'
    }

    if (files.length === 0 || files[0] === '.') {
      // Add all files
      this.state.stagingArea = [...this.state.workingDirectory]
      this.state.workingDirectory = []
      return ''
    }

    // Add specific files
    files.forEach((file) => {
      const index = this.state.workingDirectory.indexOf(file)
      if (index > -1) {
        this.state.workingDirectory.splice(index, 1)
        if (!this.state.stagingArea.includes(file)) {
          this.state.stagingArea.push(file)
        }
      }
    })

    return ''
  }

  // Create a commit
  commit(message: string, author = 'Student'): string {
    if (!this.state.initialized) {
      return 'fatal: not a git repository'
    }

    if (this.state.stagingArea.length === 0) {
      return 'nothing to commit, working tree clean'
    }

    const hash = this.generateHash()
    const parent = this.state.commits.length > 0 ? this.state.commits[this.state.commits.length - 1].hash : null

    const commit: Commit = {
      hash,
      parent,
      message,
      author,
      timestamp: Date.now(),
      files: this.state.stagingArea.map((name) => ({
        name,
        type: 'file' as const,
        content: this.workingDirectory.get(name) || '',
      })),
    }

    this.state.commits.push(commit)
    this.state.stagingArea = []

    const filesChanged = commit.files.length
    return `[${this.state.currentBranch} ${hash.substring(0, 7)}] ${message}\n ${filesChanged} file${filesChanged !== 1 ? 's' : ''} changed`
  }

  // Show commit log
  log(): string {
    if (!this.state.initialized) {
      return 'fatal: not a git repository'
    }

    if (this.state.commits.length === 0) {
      return 'fatal: your current branch does not have any commits yet'
    }

    let output = ''
    const commits = [...this.state.commits].reverse()

    commits.forEach((commit) => {
      output += `commit ${commit.hash}\n`
      output += `Author: ${commit.author}\n`
      output += `Date:   ${new Date(commit.timestamp).toLocaleString()}\n\n`
      output += `    ${commit.message}\n\n`
    })

    return output.trim()
  }

  // Create a new branch
  branch(name?: string): string {
    if (!this.state.initialized) {
      return 'fatal: not a git repository'
    }

    // List branches if no name provided
    if (!name) {
      let output = ''
      this.state.branches.forEach((branch) => {
        const prefix = branch === this.state.currentBranch ? '* ' : '  '
        output += `${prefix}${branch}\n`
      })
      return output.trim()
    }

    // Create new branch
    if (this.state.branches.includes(name)) {
      return `fatal: A branch named '${name}' already exists.`
    }

    this.state.branches.push(name)
    return ''
  }

  // Switch branches
  checkout(branch: string): string {
    if (!this.state.initialized) {
      return 'fatal: not a git repository'
    }

    if (!this.state.branches.includes(branch)) {
      return `error: pathspec '${branch}' did not match any file(s) known to git`
    }

    if (this.state.currentBranch === branch) {
      return `Already on '${branch}'`
    }

    this.state.currentBranch = branch
    return `Switched to branch '${branch}'`
  }

  // Add a file to working directory (simulate file creation/modification)
  addFile(name: string, content = ''): void {
    this.workingDirectory.set(name, content)
    if (!this.state.workingDirectory.includes(name)) {
      this.state.workingDirectory.push(name)
    }
  }

  // Get current state
  getState(): GitState {
    return { ...this.state }
  }

  // Reset state (for new challenges)
  reset(): void {
    this.state = {
      initialized: false,
      currentBranch: 'main',
      branches: [],
      commits: [],
      workingDirectory: [],
      stagingArea: [],
    }
    this.workingDirectory.clear()
  }

  // Generate a fake commit hash
  private generateHash(): string {
    return Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
  }
}