/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { GitBranch, GitCommit } from 'lucide-react'
import { VisualTree } from '@/lib/git-simulator/GitVisualizer'
import { cn } from '@/lib/utils/cn'

interface GitTreeProps {
  tree: VisualTree
  className?: string
}

export function GitTree({ tree, className }: GitTreeProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredCommit, setHoveredCommit] = useState<string | null>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  useEffect(() => {
    // Calculate dimensions based on tree
    const maxX = Math.max(...tree.commits.map((c) => c.x), 0)
    const maxY = Math.max(...tree.commits.map((c) => c.y), 0)
    setDimensions({
      width: Math.max(maxX + 300, 800),
      height: Math.max(maxY + 200, 400),
    })
  }, [tree])

  if (tree.commits.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12',
          className
        )}
      >
        <div className="text-center">
          <GitBranch className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-600">No commits yet</p>
          <p className="mt-1 text-sm text-gray-500">Run git commands to see the visualization</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg border bg-white p-4 overflow-auto', className)}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">Git Visualization</h3>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{tree.commits.length} commits</span>
          <span>•</span>
          <span>{tree.branches.length} branches</span>
        </div>
      </div>

      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="mx-auto"
        style={{ minHeight: '300px' }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#9ca3af" />
          </marker>
        </defs>

        {/* Edges (connections between commits) */}
        <g>
          {tree.edges.map((edge, index) => {
            const fromCommit = tree.commits.find((c) => c.id === edge.from)
            const toCommit = tree.commits.find((c) => c.id === edge.to)

            if (!fromCommit || !toCommit) return null

            return (
              <motion.line
                key={`${edge.from}-${edge.to}-${index}`}
                x1={fromCommit.x + 150}
                y1={fromCommit.y + 50}
                x2={toCommit.x + 150}
                y2={toCommit.y + 50}
                stroke="#9ca3af"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            )
          })}
        </g>

        {/* Commits */}
        <g>
          {tree.commits.map((commit, index) => {
            const branchColor = tree.branches.find((b) =>
              commit.branches.includes(b.name)
            )?.color || '#22c55e'

            return (
              <g
                key={commit.id}
                onMouseEnter={() => setHoveredCommit(commit.id)}
                onMouseLeave={() => setHoveredCommit(null)}
              >
                <motion.circle
                  cx={commit.x + 150}
                  cy={commit.y + 50}
                  r="20"
                  fill={branchColor}
                  stroke={commit.isHead ? '#fbbf24' : '#fff'}
                  strokeWidth={commit.isHead ? '4' : '2'}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="cursor-pointer"
                />

                {/* Commit hash */}
                <motion.text
                  x={commit.x + 150}
                  y={commit.y + 55}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="10"
                  fontWeight="bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {commit.hash.substring(0, 4)}
                </motion.text>

                {/* Branch labels */}
                {commit.branches.map((branchName, branchIndex) => {
                  const branch = tree.branches.find((b) => b.name === branchName)
                  return (
                    <g key={`${commit.id}-${branchName}`}>
                      <motion.rect
                        x={commit.x + 180}
                        y={commit.y + 40 + branchIndex * 20}
                        width={branchName.length * 7 + 10}
                        height="18"
                        rx="4"
                        fill={branch?.color || '#22c55e'}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      />
                      <motion.text
                        x={commit.x + 185}
                        y={commit.y + 52 + branchIndex * 20}
                        fill="#fff"
                        fontSize="11"
                        fontWeight="600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                      >
                        {branchName}
                      </motion.text>
                      {branch?.isHead && (
                        <motion.text
                          x={commit.x + 185 + branchName.length * 7 + 12}
                          y={commit.y + 52 + branchIndex * 20}
                          fill="#fbbf24"
                          fontSize="11"
                          fontWeight="bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.5 }}
                        >
                          HEAD
                        </motion.text>
                      )}
                    </g>
                  )
                })}

                {/* Commit message tooltip */}
                {hoveredCommit === commit.id && (
                  <g>
                    <rect
                      x={commit.x + 150 - 100}
                      y={commit.y + 80}
                      width="200"
                      height="60"
                      rx="4"
                      fill="#1f2937"
                      opacity="0.95"
                    />
                    <text
                      x={commit.x + 150}
                      y={commit.y + 100}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="12"
                      fontWeight="600"
                    >
                      {commit.message.substring(0, 30)}
                    </text>
                    <text
                      x={commit.x + 150}
                      y={commit.y + 118}
                      textAnchor="middle"
                      fill="#9ca3af"
                      fontSize="10"
                    >
                      {commit.author}
                    </text>
                    <text
                      x={commit.x + 150}
                      y={commit.y + 132}
                      textAnchor="middle"
                      fill="#9ca3af"
                      fontSize="10"
                    >
                      {commit.timestamp.toLocaleTimeString()}
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </g>
      </svg>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 border-t pt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span className="text-gray-600">Commit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full border-4 border-yellow-400 bg-green-500" />
          <span className="text-gray-600">HEAD</span>
        </div>
        <div className="flex items-center gap-2">
          <GitCommit className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">Hover for details</span>
        </div>
      </div>
    </div>
  )
}