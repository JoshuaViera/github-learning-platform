// src/lib/git-simulator/CommandExecutor.ts
import { GitEngine } from './GitEngine'

export interface CommandResult {
  output: string
  type: 'output' | 'error' | 'success'
  success?: boolean
}

export class CommandExecutor {
  private gitEngine: GitEngine

  constructor() {
    this.gitEngine = new GitEngine()
  }

  async execute(command: string): Promise<CommandResult> {
    const parts = command.trim().split(' ')
    const cmd = parts[0].toLowerCase()

    try {
      switch (cmd) {
        case 'git':
          return this.executeGitCommand(parts.slice(1))
        
        case 'touch':
          return this.executeTouch(parts.slice(1))
        
        case 'echo':
          return this.executeEcho(parts.slice(1))
        
        case 'cat':
          return this.executeCat(parts.slice(1))
        
        case 'ls':
          return this.executeLs()
        
        case 'pwd':
          return this.executePwd()
        
        case 'clear':
          return { output: 'CLEAR_TERMINAL', type: 'output' }
        
        case 'help':
          return this.executeHelp()
        
        default:
          return {
            output: `Command not found: ${cmd}\nType 'help' for available commands.`,
            type: 'error',
          }
      }
    } catch (error) {
      return {
        output: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error',
      }
    }
  }

  private executeGitCommand(args: string[]): CommandResult {
    if (args.length === 0) {
      return {
        output: `usage: git <command> [<args>]

Common Git commands:
   init       Create an empty Git repository
   status     Show the working tree status
   add        Add file contents to the index
   commit     Record changes to the repository
   branch     List, create, or delete branches
   checkout   Switch branches
   log        Show commit logs
   merge      Join development histories together`,
        type: 'output',
      }
    }

    const subcommand = args[0].toLowerCase()
    const subargs = args.slice(1)

    try {
      switch (subcommand) {
        case 'init':
          return { output: this.gitEngine.init(), type: 'success' }
        
        case 'status':
          return { output: this.gitEngine.status(), type: 'output' }
        
        case 'add':
          if (subargs.length === 0) {
            return { output: 'Nothing specified, nothing added.', type: 'error' }
          }
          return { output: this.gitEngine.add(subargs[0]), type: 'success' }
        
        case 'commit':
          const messageIndex = subargs.indexOf('-m')
          if (messageIndex === -1 || messageIndex === subargs.length - 1) {
            return { output: 'error: switch `m\' requires a value', type: 'error' }
          }
          const message = subargs.slice(messageIndex + 1).join(' ').replace(/["']/g, '')
          return { output: this.gitEngine.commit(message), type: 'success' }
        
        case 'branch':
          return { output: this.gitEngine.branch(subargs[0]), type: 'output' }
        
        case 'checkout':
          if (subargs[0] === '-b' && subargs.length > 1) {
            return { output: this.gitEngine.checkoutNewBranch(subargs[1]), type: 'success' }
          }
          return { output: this.gitEngine.checkout(subargs[0]), type: 'success' }
        
        case 'log':
          return { output: this.gitEngine.log(), type: 'output' }
        
        case 'merge':
          if (subargs.length === 0) {
            return { output: 'error: branch name required', type: 'error' }
          }
          return { output: this.gitEngine.merge(subargs[0]), type: 'success' }
        
        default:
          return {
            output: `git: '${subcommand}' is not a git command. See 'git help'.`,
            type: 'error',
          }
      }
    } catch (error) {
      return {
        output: error instanceof Error ? error.message : 'Unknown error',
        type: 'error',
      }
    }
  }

  private executeTouch(args: string[]): CommandResult {
    if (args.length === 0) {
      return { output: 'touch: missing file operand', type: 'error' }
    }

    const filename = args[0]
    const result = this.gitEngine.createFile(filename)
    
    return {
      output: result || '',
      type: result.includes('error') || result.includes('fatal') ? 'error' : 'success',
    }
  }

  private executeEcho(args: string[]): CommandResult {
    if (args.length === 0) {
      return { output: '', type: 'output' }
    }

    const content = args.join(' ').replace(/["']/g, '')
    
    // Check if redirecting to file
    const redirectIndex = args.indexOf('>')
    if (redirectIndex !== -1 && redirectIndex < args.length - 1) {
      const filename = args[redirectIndex + 1]
      const textContent = args.slice(0, redirectIndex).join(' ').replace(/["']/g, '')
      this.gitEngine.createFile(filename, textContent)
      return { output: '', type: 'success' }
    }

    return { output: content, type: 'output' }
  }

  private executeCat(args: string[]): CommandResult {
    if (args.length === 0) {
      return { output: 'cat: missing file operand', type: 'error' }
    }

    const filename = args[0]
    const state = this.gitEngine.getState()
    
    if (!state.workingDirectory.includes(filename)) {
      return { output: `cat: ${filename}: No such file or directory`, type: 'error' }
    }

    return { output: `[Contents of ${filename}]`, type: 'output' }
  }

  private executeLs(): CommandResult {
    const state = this.gitEngine.getState()
    const files = state.workingDirectory.join('  ')
    return { output: files || '', type: 'output' }
  }

  private executePwd(): CommandResult {
    return { output: '~/project', type: 'output' }
  }

  private executeHelp(): CommandResult {
    return {
      output: `Available commands:
  help           Show this help message
  clear          Clear the terminal
  pwd            Print working directory
  ls             List files
  touch <file>   Create a file
  cat <file>     Display file contents
  echo <text>    Print text
  
Git commands:
  git init       Initialize a repository
  git status     Show repository status
  git add        Stage files
  git commit     Commit changes
  git branch     Manage branches
  git checkout   Switch branches
  git log        View commit history
  git merge      Merge branches`,
      type: 'output',
    }
  }

  getGitEngine(): GitEngine {
    return this.gitEngine
  }

  reset(): void {
    this.gitEngine.reset()
  }
}