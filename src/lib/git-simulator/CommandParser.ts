// src/lib/git-simulator/CommandParser.ts
export interface ParsedCommand {
  command: string
  subcommand?: string
  args: string[]
  flags: Map<string, string | boolean>
}

export class CommandParser {
  static parse(input: string): ParsedCommand {
    const parts = input.trim().split(/\s+/)
    const command = parts[0].toLowerCase()

    if (command !== 'git') {
      return {
        command,
        args: parts.slice(1),
        flags: new Map(),
      }
    }

    // Parse Git command
    const subcommand = parts[1]?.toLowerCase()
    const remaining = parts.slice(2)

    const args: string[] = []
    const flags = new Map<string, string | boolean>()

    let i = 0
    while (i < remaining.length) {
      const part = remaining[i]

      if (part.startsWith('--')) {
        // Long flag (--message or --message=value)
        const [flagName, flagValue] = part.substring(2).split('=')
        if (flagValue !== undefined) {
          flags.set(flagName, flagValue)
        } else if (i + 1 < remaining.length && !remaining[i + 1].startsWith('-')) {
          flags.set(flagName, remaining[i + 1])
          i++
        } else {
          flags.set(flagName, true)
        }
      } else if (part.startsWith('-') && part.length === 2) {
        // Short flag (-m)
        const flagName = part.substring(1)
        if (i + 1 < remaining.length && !remaining[i + 1].startsWith('-')) {
          flags.set(flagName, remaining[i + 1])
          i++
        } else {
          flags.set(flagName, true)
        }
      } else {
        // Regular argument
        args.push(part)
      }

      i++
    }

    return {
      command,
      subcommand,
      args,
      flags,
    }
  }

  static isGitCommand(command: string): boolean {
    return command.toLowerCase().startsWith('git')
  }
}