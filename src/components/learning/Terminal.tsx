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
  const [currentDirectory] = useState(initialDirectory)
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  const handleTerminalClick = () => {
    if (!readOnly) {
      inputRef.current?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentInput.trim() || isProcessing) return

    const command = currentInput.trim()

    // Validate proper spacing (no multiple spaces between args)
    if (/\s{2,}/.test(command)) {
      setLines((prev) => [
        ...prev,
        {
          type: 'command',
          content: command,
          timestamp: Date.now(),
        },
        {
          type: 'error',
          content: 'Error: Multiple spaces detected between arguments',
          timestamp: Date.now(),
        },
        {
          type: 'output',
          content: '💡 Tip: Use only single spaces between words (e.g., "git add file.txt")',
          timestamp: Date.now(),
        },
      ])
      setCurrentInput('')
      return
    }

    setCommandHistory((prev) => [...prev, command])
    setHistoryIndex(-1)

    setLines((prev) => [
      ...prev,
      {
        type: 'command',
        content: command,
        timestamp: Date.now(),
      },
    ])

    setCurrentInput('')
    setIsProcessing(true)

    try {
      const result = onCommand
        ? await onCommand(command)
        : await executeBuiltInCommand(command)

      if (result.output === '') {
        setIsProcessing(false)
        return
      }

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
          content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
          timestamp: Date.now(),
        },
      ])
    } finally {
      setIsProcessing(false)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

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
  
💡 Remember: Use single spaces between words, just like a real terminal!`,
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
   merge      Join development histories together
   push       Update remote refs
   pull       Fetch and integrate with another repository
   
Use 'git help <command>' for more information.`,
            type: 'output',
          }
        }
        return {
          output: `git: '${parts.slice(1).join(' ')}' - Command passed to challenge executor`,
          type: 'error',
        }

      case '':
        return { output: '', type: 'output' }

      default:
        return {
          output: `Command not found: ${cmd}
Type 'help' for available commands, or try a Git command like 'git init'`,
          type: 'error',
        }
    }
  }

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
    } else if (e.key === 'Tab') {
      e.preventDefault()
    }
  }

  const handleCopy = async () => {
    const content = lines
      .map((line) => {
        if (line.type === 'command') {
          return `$ ${line.content}`
        }
        return line.content
      })
      .join('\n')

    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className={cn('flex flex-col rounded-lg border border-gray-300 bg-gray-900', className)}>
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4 text-green-400" />
          <span className="text-sm font-medium text-gray-300">Terminal</span>
          <span className="text-xs text-gray-500">{currentDirectory}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition-colors"
          title="Copy terminal content"
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
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              autoFocus
            />
          </form>
        )}
      </div>
    </div>
  )
}