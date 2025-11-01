'use client'

import { useState, useRef, useEffect } from 'react'
import { Terminal as TerminalIcon, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface TerminalLine {
  type: 'command' | 'output' | 'error' | 'success'
  content: string
  timestamp: number
}

interface TerminalProps {
  onCommand?: (command: string) => Promise<{ output: string; type: 'output' | 'error' | 'success' }>
  initialDirectory?: string
  readOnly?: boolean
  className?: string
}

export function Terminal({
  onCommand,
  initialDirectory = '~/project',
  readOnly = false,
  className,
}: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      type: 'output',
      content: 'Welcome to Git Learning Terminal! Type "help" for available commands.',
      timestamp: Date.now(),
    },
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentDirectory, setCurrentDirectory] = useState(initialDirectory)
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new lines are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  // Focus input when terminal is clicked
  const handleTerminalClick = () => {
    if (!readOnly) {
      inputRef.current?.focus()
    }
  }

  // Handle command submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentInput.trim() || isProcessing) return

    const command = currentInput.trim()

    // Add command to history
    setCommandHistory((prev) => [...prev, command])
    setHistoryIndex(-1)

    // Add command line to terminal
    setLines((prev) => [
      ...prev,
      {
        type: 'command',
        content: command,
        timestamp: Date.now(),
      },
    ])

    // Clear input
    setCurrentInput('')
    setIsProcessing(true)

    try {
      // Execute command
      const result = onCommand
        ? await onCommand(command)
        : await executeBuiltInCommand(command)

      // Add output to terminal
      setLines((prev) => [
        ...prev,
        {
          type: result.type,
          content: result.output,
          timestamp: Date.now(),
        },
      ])
    } catch (error) {
      setLines((prev) => [
        ...prev,
        {
          type: 'error',
          content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: Date.now(),
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  // Built-in commands (fallback if no onCommand provided)
  const executeBuiltInCommand = async (
    command: string
  ): Promise<{ output: string; type: 'output' | 'error' | 'success' }> => {
    const parts = command.split(' ')
    const cmd = parts[0].toLowerCase()

    switch (cmd) {
      case 'help':
        return {
          output: `Available commands:
  help     - Show this help message
  clear    - Clear the terminal
  pwd      - Print working directory
  ls       - List files
  git      - Git commands (git init, git status, etc.)
  
Type any Git command to practice!`,
          type: 'output',
        }

      case 'clear':
        setLines([])
        return { output: '', type: 'output' }

      case 'pwd':
        return { output: currentDirectory, type: 'output' }

      case 'ls':
        return {
          output: 'README.md  index.html  styles.css',
          type: 'output',
        }

      case 'git':
        if (parts.length === 1) {
          return {
            output: `usage: git <command> [<args>]

Common Git commands:
   init       Create an empty Git repository
   status     Show the working tree status
   add        Add file contents to the index
   commit     Record changes to the repository
   branch     List, create, or delete branches
   checkout   Switch branches or restore files
   log        Show commit logs
   
Use 'git help <command>' for more information.`,
            type: 'output',
          }
        }
        return {
          output: `git: '${parts.slice(1).join(' ')}' is not a git command. Type 'git' for available commands.`,
          type: 'error',
        }

      default:
        return {
          output: `Command not found: ${cmd}. Type 'help' for available commands.`,
          type: 'error',
        }
    }
  }

  // Handle keyboard navigation (up/down for history)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length === 0) return

      const newIndex =
        historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(newIndex)
      setCurrentInput(commandHistory[newIndex])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return

      const newIndex = historyIndex + 1
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1)
        setCurrentInput('')
      } else {
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[newIndex])
      }
    }
  }

  // Copy terminal content
  const handleCopy = async () => {
    const content = lines.map((line) => {
      if (line.type === 'command') {
        return `$ ${line.content}`
      }
      return line.content
    }).join('\n')

    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('flex flex-col rounded-lg border border-gray-300 bg-gray-900', className)}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4 text-green-400" />
          <span className="text-sm font-medium text-gray-300">Terminal</span>
          <span className="text-xs text-gray-500">{currentDirectory}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-700 hover:text-gray-200"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        onClick={handleTerminalClick}
        className="min-h-[400px] max-h-[600px] overflow-y-auto p-4 font-mono text-sm cursor-text"
      >
        {lines.map((line, index) => (
          <div key={`${line.timestamp}-${index}`} className="mb-1">
            {line.type === 'command' ? (
              <div className="flex items-start gap-2">
                <span className="text-green-400">$</span>
                <span className="text-gray-100">{line.content}</span>
              </div>
            ) : (
              <div
                className={cn('whitespace-pre-wrap', {
                  'text-gray-300': line.type === 'output',
                  'text-red-400': line.type === 'error',
                  'text-green-400': line.type === 'success',
                })}
              >
                {line.content}
              </div>
            )}
          </div>
        ))}

        {/* Current Input Line */}
        {!readOnly && (
          <form onSubmit={handleSubmit} className="flex items-start gap-2">
            <span className="text-green-400">$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              className="flex-1 bg-transparent text-gray-100 outline-none disabled:opacity-50"
              placeholder={isProcessing ? 'Processing...' : 'Type a command...'}
              autoFocus
            />
          </form>
        )}
      </div>
    </div>
  )
}