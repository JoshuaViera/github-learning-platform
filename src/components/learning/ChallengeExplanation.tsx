/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { BookOpen, Lightbulb, AlertCircle, Briefcase } from 'lucide-react'
import { ChallengeExplanation as ExplanationType } from '@/types'

interface ChallengeExplanationProps {
  explanation: ExplanationType
  className?: string
}

export function ChallengeExplanation({ explanation, className }: ChallengeExplanationProps) {
  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Overview */}
      <div className="rounded-lg border bg-blue-50 p-6">
        <div className="mb-3 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">What You&apos;re Learning</h3>
        </div>
        <p className="text-blue-800">{explanation.overview}</p>
      </div>

      {/* Why It Matters */}
      <div className="rounded-lg border bg-green-50 p-6">
        <div className="mb-3 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold text-green-900">Why This Matters</h3>
        </div>
        <p className="text-green-800">{explanation.why}</p>
      </div>

      {/* Vocabulary */}
      {explanation.vocabulary.length > 0 && (
        <div className="rounded-lg border bg-purple-50 p-6">
          <h3 className="mb-4 font-semibold text-purple-900">Key Terms</h3>
          <div className="space-y-4">
            {explanation.vocabulary.map((term) => (
              <div key={term.term} className="rounded-lg bg-white p-4 shadow-sm">
                <h4 className="font-semibold text-purple-900">{term.term}</h4>
                <p className="mt-1 text-sm text-gray-700">{term.definition}</p>
                {term.example && (
                  <p className="mt-2 text-xs text-gray-600">
                    <span className="font-semibold">Example:</span> {term.example}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real World Example */}
      {explanation.realWorldExample && (
        <div className="rounded-lg border bg-orange-50 p-6">
          <div className="mb-3 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold text-orange-900">Real-World Application</h3>
          </div>
          <p className="text-orange-800">{explanation.realWorldExample}</p>
        </div>
      )}

      {/* Common Mistakes */}
      {explanation.commonMistakes && explanation.commonMistakes.length > 0 && (
        <div className="rounded-lg border bg-red-50 p-6">
          <div className="mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Common Mistakes to Avoid</h3>
          </div>
          <ul className="space-y-2">
            {explanation.commonMistakes.map((mistake, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-red-800">
                <span className="mt-1 text-red-600">•</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}