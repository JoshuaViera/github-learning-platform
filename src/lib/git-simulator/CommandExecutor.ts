import { GitEngine } from './GitEngine'
import { CommandParser } from './CommandParser'

export interface CommandResult {
  output: string
  type: 'output' | 'error' | 'success'
  success?: boolean 
}

export class CommandExecutor {
  private gitEngine: GitEngine

  constructor(gitEngine?: GitEngine) {
    this.gitEngine = gitEngine || new GitEngine()
  }

  async execute(input: string): Promise<CommandResult> {
    const parsed = CommandParser.parse(input)

    if (parsed.command !== 'git') {
      return this.executeSystemCommand(parsed.command, parsed.args)
    }

    if (!parsed.subcommand) {
      return {
        output: `usage: git <command> [<args>]

These are common Git commands used in various situations:

start a working area
   init       Create an empty Git repository

work on the current change
   add        Add file contents to the index
   status     Show the working tree status

grow, mark and tweak your common history
   branch     List, create, or delete branches
   checkout   Switch branches
   commit     Record changes to the repository
   log        Show commit logs

'git help -a' lists available subcommands`,
        type: 'output',
      }
    }

    return this.executeGitCommand(parsed.subcommand, parsed.args, parsed.flags)
  }

  private async executeSystemCommand(
    command: string,
    args: string[]
  ): Promise<CommandResult> {
    switch (command) {
      case 'clear':
        return { output: 'CLEAR_TERMINAL', type: 'output' }

      case 'help':
        return {
          output: `Git Learning Terminal - Available Commands:

System Commands:
  clear      Clear the terminal screen
  help       Show this help message
  pwd        Print working directory
  ls         List directory contents

Git Commands:
  git init           Initialize a repository
  git status         Check repository status
  git add <file>     Stage files for commit
  git add .          Stage all files
  git commit -m      Commit staged changes
  git log            View commit history
  git branch         List/create branches
  git checkout       Switch branches

Examples:
  git init
  git add README.md
  git commit -m "Initial commit"
  git branch feature
  git checkout feature

Type 'git' for more Git command information.`,
          type: 'output',
        }

      case 'pwd':
        return {
          output: '/home/student/project',
          type: 'output',
        }

      case 'ls':
        return {
          output: 'README.md  index.html  styles.css  script.js',
          type: 'output',
        }

      case 'cat':
        if (args.length === 0) {
          return {
            output: 'cat: missing file operand',
            type: 'error',
          }
        }
        return {
          output: `# ${args[0]}\n\nThis is a sample file for learning Git.`,
          type: 'output',
        }

      case 'touch':
        if (args.length === 0) {
          return {
            output: 'touch: missing file operand',
            type: 'error',
          }
        }
        args.forEach((filename) => {
          this.gitEngine.addFile(filename, '')
        })
        return {
          output: '',
          type: 'success',
        }

      case 'echo':
        return {
          output: args.join(' '),
          type: 'output',
        }

      default:
        return {
          output: `Command not found: ${command}\nType 'help' for available commands.`,
          type: 'error',
        }
    }
  }

  private async executeGitCommand(
    subcommand: string,
    args: string[],
    flags: Map<string, string | boolean>
  ): Promise<CommandResult> {
    try {
      let output = ''

      switch (subcommand) {
        case 'init':
          output = this.gitEngine.init()
          return { output, type: 'success' }

        case 'status':
          output = this.gitEngine.status()
          return { output, type: 'output' }

        case 'add':
          if (args.length === 0) {
            return {
              output: `Nothing specified, nothing added.
Maybe you wanted to say 'git add .'?`,
              type: 'error',
            }
          }
          output = this.gitEngine.add(args)
          return {
            output: output || `Files staged successfully`,
            type: output ? 'error' : 'success',
          }

        case 'commit':
          const message = (flags.get('m') || flags.get('message')) as string
          if (!message) {
            return {
              output: `error: switch 'm' requires a value`,
              type: 'error',
            }
          }
          output = this.gitEngine.commit(message)
          return {
            output,
            type: output.includes('fatal') || output.includes('nothing to commit') ? 'error' : 'success',
          }

        case 'log':
          output = this.gitEngine.log()
          return {
            output,
            type: output.includes('fatal') ? 'error' : 'output',
          }

        case 'branch':
          output = this.gitEngine.branch(args[0])
          return {
            output: output || `Branch '${args[0]}' created`,
            type: output.includes('fatal') ? 'error' : args[0] ? 'success' : 'output',
          }

        case 'checkout':
          if (args.length === 0) {
            return {
              output: `error: switch 'checkout' requires a value`,
              type: 'error',
            }
          }
          output = this.gitEngine.checkout(args[0])
          return {
            output,
            type: output.includes('error') ? 'error' : 'success',
          }

        case 'help':
          return {
            output: `usage: git [--version] [--help] <command> [<args>]

These are common Git commands:

start a working area
   init      Create an empty Git repository

work on the current change
   add       Add file contents to the index
   status    Show the working tree status

grow, mark and tweak your common history
   branch    List, create, or delete branches
   checkout  Switch branches
   commit    Record changes to the repository
   log       Show commit logs`,
            type: 'output',
          }

        default:
          return {
            output: `git: '${subcommand}' is not a git command. See 'git --help'.`,
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

  getGitEngine(): GitEngine {
    return this.gitEngine
  }

  reset(): void {
    this.gitEngine.reset()
  }
}