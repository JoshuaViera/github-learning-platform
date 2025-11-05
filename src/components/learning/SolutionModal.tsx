'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, CheckCircle, Lightbulb, Code, BookOpen } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface SolutionModalProps {
  isOpen: boolean
  onClose: () => void
  challenge: {
    title: string
    solution: {
      commands: string[]
      explanation: string
    }
  }
  userCommands?: string[]
}

export function SolutionModal({ isOpen, onClose, challenge, userCommands = [] }: SolutionModalProps) {
  const optimalCommands = challenge.solution.commands.length
  const userCommandsCount = userCommands.length
  const efficiency =
    userCommandsCount > 0 ? ((optimalCommands / userCommandsCount) * 100).toFixed(0) : 0

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b bg-gradient-to-r from-green-50 to-blue-50 p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-500 p-2">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <Dialog.Title className="text-xl font-bold text-gray-900">
                        Solution Explanation
                      </Dialog.Title>
                      <p className="text-sm text-gray-600">{challenge.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 text-gray-400 hover:bg-white hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-6">
                  {/* Performance Stats */}
                  <div className="mb-6 grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">{optimalCommands}</div>
                      <div className="text-xs text-gray-600">Optimal Commands</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{userCommandsCount}</div>
                      <div className="text-xs text-gray-600">Your Commands</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{efficiency}%</div>
                      <div className="text-xs text-gray-600">Efficiency</div>
                    </div>
                  </div>

                  {/* Optimal Solution */}
                  <div className="mb-6">
                    <div className="mb-3 flex items-center gap-2">
                      <Code className="h-5 w-5 text-primary-600" />
                      <h3 className="font-semibold text-gray-900">Optimal Solution</h3>
                    </div>
                    <div className="rounded-lg overflow-hidden border">
                      <SyntaxHighlighter
                        language="bash"
                        style={vscDarkPlus}
                        customStyle={{ margin: 0, borderRadius: 0 }}
                      >
                        {challenge.solution.commands.join('\n')}
                      </SyntaxHighlighter>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="mb-6">
                    <div className="mb-3 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary-600" />
                      <h3 className="font-semibold text-gray-900">How It Works</h3>
                    </div>
                    <div className="rounded-lg border bg-gray-50 p-4">
                      <p className="text-gray-700 leading-relaxed">{challenge.solution.explanation}</p>
                    </div>
                  </div>

                  {/* Step-by-Step Breakdown */}
                  <div className="mb-6">
                    <div className="mb-3 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary-600" />
                      <h3 className="font-semibold text-gray-900">Step-by-Step</h3>
                    </div>
                    <div className="space-y-3">
                      {challenge.solution.commands.map((command, index) => (
                        <div key={index} className="flex gap-3 rounded-lg border bg-white p-3">
                          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                            {index + 1}
                          </div>
                          <div>
                            <code className="text-sm font-mono text-gray-900">{command}</code>
                            <p className="mt-1 text-sm text-gray-600">
                              {getCommandExplanation(command)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Your Approach (if different) */}
                  {userCommandsCount > optimalCommands && (
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 flex-shrink-0 text-yellow-600" />
                        <div>
                          <h4 className="font-semibold text-yellow-900">Optimization Tip</h4>
                          <p className="mt-1 text-sm text-yellow-800">
                            You used {userCommandsCount - optimalCommands} extra command
                            {userCommandsCount - optimalCommands > 1 ? 's' : ''}. The solution above
                            shows a more efficient approach!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t bg-gray-50 px-6 py-4">
                  <button
                    onClick={onClose}
                    className="w-full rounded-lg bg-primary-600 py-3 font-semibold text-white hover:bg-primary-700"
                  >
                    Got it!
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

function getCommandExplanation(command: string): string {
  const cmd = command.trim().toLowerCase()

  if (cmd.startsWith('git init')) {
    return 'Initializes a new Git repository in the current directory'
  }
  if (cmd.startsWith('git add')) {
    return 'Stages changes for the next commit'
  }
  if (cmd.startsWith('git commit')) {
    return 'Records staged changes to the repository history'
  }
  if (cmd.startsWith('git branch')) {
    return 'Creates, lists, or manages branches'
  }
  if (cmd.startsWith('git checkout')) {
    return 'Switches between branches or restores files'
  }
  if (cmd.startsWith('git merge')) {
    return 'Combines changes from different branches'
  }
  if (cmd.startsWith('git status')) {
    return 'Shows the current state of the working directory'
  }
  if (cmd.startsWith('git log')) {
    return 'Displays commit history'
  }
  if (cmd.startsWith('touch')) {
    return 'Creates a new empty file'
  }
  if (cmd.startsWith('echo')) {
    return 'Writes content to a file'
  }

  return 'Executes a Git command'
}