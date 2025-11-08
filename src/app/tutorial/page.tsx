// src/app/tutorial/page.tsx
'use client'

// import { useState } from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  Terminal, 
  GitBranch, 
  CheckCircle, 
  ArrowRight,
  Play,
  Code,
  Lightbulb,
  Trophy,
  Target
} from 'lucide-react'

export default function TutorialPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="border-b bg-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mx-auto max-w-3xl">
            <BookOpen className="mx-auto h-16 w-16 text-primary-600" />
            <h1 className="mt-6 text-4xl font-bold text-gray-900 sm:text-5xl">
              Master Git Through Practice
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              An interactive learning platform that teaches Git commands through hands-on challenges, 
              real-time visualization, and instant feedback.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/challenges"
                className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700"
              >
                Start Learning
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg border-2 border-primary-600 px-6 py-3 font-semibold text-primary-600 hover:bg-primary-50"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is Git? */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
              What is Git?
            </h2>
            
            <div className="rounded-lg border bg-white p-8 shadow-sm">
              <div className="space-y-6 text-gray-700">
                <p className="text-lg">
                  <strong className="text-gray-900">Git</strong> is a <strong>version control system</strong> - 
                  think of it as a &ldquo;save game&rdquo; feature for your code. It lets you:
                </p>
                
                <ul className="space-y-3 pl-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span><strong>Track changes</strong> - See exactly what changed, when, and why</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span><strong>Work in parallel</strong> - Multiple people can work on the same project simultaneously</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span><strong>Undo mistakes</strong> - Go back to any previous version of your code</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span><strong>Experiment safely</strong> - Try new features without breaking existing code</span>
                  </li>
                </ul>

                <div className="mt-8 rounded-lg bg-blue-50 p-6">
                  <h3 className="mb-3 font-semibold text-blue-900">Real-World Analogy</h3>
                  <p className="text-blue-800">
                    Imagine writing a book with multiple authors. Git is like having a master copy where 
                    everyone can write their chapters separately, see what others wrote, combine everyone&apos;s 
                    work, and always have a backup of every version that ever existed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How This Platform Works */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            How This Platform Works
          </h2>

          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard
                icon={<Terminal className="h-8 w-8" />}
                title="Interactive Terminal"
                description="Type real Git commands in a safe, simulated environment. No risk of breaking anything!"
                color="blue"
              />
              <FeatureCard
                icon={<GitBranch className="h-8 w-8" />}
                title="Visual Feedback"
                description="See your Git repository visualized in real-time as you execute commands."
                color="green"
              />
              <FeatureCard
                icon={<Lightbulb className="h-8 w-8" />}
                title="Smart Hints"
                description="Stuck? Get progressive hints that guide you without giving away the answer."
                color="yellow"
              />
              <FeatureCard
                icon={<CheckCircle className="h-8 w-8" />}
                title="Instant Validation"
                description="Check your solution anytime and get immediate feedback on what&apos;s correct."
                color="purple"
              />
              <FeatureCard
                icon={<Trophy className="h-8 w-8" />}
                title="Track Progress"
                description="Earn points, complete modules, and watch your Git skills grow over time."
                color="orange"
              />
              <FeatureCard
                icon={<Code className="h-8 w-8" />}
                title="Real Commands"
                description="Learn actual Git commands used by professional developers every day."
                color="red"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Your Learning Journey
          </h2>

          <div className="mx-auto max-w-4xl">
            <div className="space-y-6">
              <LearningStep
                number={1}
                title="Git Basics"
                description="Start with fundamentals: initialize repositories, make commits, and understand the staging area."
                challenges={7}
                points={105}
              />
              <LearningStep
                number={2}
                title="Branching & Workflows"
                description="Learn to create branches, switch between them, and manage parallel development."
                challenges={6}
                points={120}
              />
              <LearningStep
                number={3}
                title="Merging Strategies"
                description="Master different merge types and understand how to combine code from different branches."
                challenges={3}
                points={90}
              />
              <LearningStep
                number={4}
                title="Remote Repositories"
                description="Work with GitHub: push, pull, clone, and collaborate with others."
                challenges={5}
                points={105}
              />
              <LearningStep
                number={5}
                title="Advanced Techniques"
                description="Explore stashing, tagging, and other advanced Git features."
                challenges={2}
                points={45}
              />
              <LearningStep
                number={6}
                title="Capstone Project"
                description="Put it all together in a comprehensive real-world workflow scenario."
                challenges={1}
                points={40}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Concepts */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Essential Git Vocabulary
          </h2>

          <div className="mx-auto max-w-4xl">
            <div className="grid gap-6 md:grid-cols-2">
              <VocabCard
                term="Repository (Repo)"
                definition="A folder that Git tracks. Contains all your project files plus a hidden .git folder with the complete history."
                example="Running 'git init' creates a new repository"
              />
              <VocabCard
                term="Commit"
                definition="A snapshot of your project at a specific point in time. Like hitting 'save' on your progress."
                example="'git commit -m message' creates a commit"
              />
              <VocabCard
                term="Staging Area"
                definition="A preview space where you prepare files before committing them. Lets you organize what changes go together."
                example="'git add file.txt' stages a file"
              />
              <VocabCard
                term="Branch"
                definition="An independent line of development. Lets you work on features without affecting the main codebase."
                example="'git branch feature-login' creates a branch"
              />
              <VocabCard
                term="Merge"
                definition="Combining changes from one branch into another. Brings your feature work back into the main code."
                example="'git merge feature-login' merges a branch"
              />
              <VocabCard
                term="Remote"
                definition="A version of your repository hosted elsewhere (like GitHub). Enables collaboration and backup."
                example="'git push origin main' uploads to remote"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl">
            <Target className="mx-auto h-16 w-16 text-primary-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Ready to Start Learning?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Jump into your first challenge and start building real Git skills. 
              No prior experience required - we&apos;ll guide you every step of the way.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/challenges"
                className="flex items-center gap-2 rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white hover:bg-primary-700"
              >
                <Play className="h-5 w-5" />
                Start First Challenge
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Helper Components
function FeatureCard({ 
  icon, 
  title, 
  description, 
  color 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  color: string
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className={`inline-flex rounded-lg p-3 ${colorClasses[color as keyof typeof colorClasses]}`}>
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  )
}

function LearningStep({
  number,
  title,
  description,
  challenges,
  points,
}: {
  number: number
  title: string
  description: string
  challenges: number
  points: number
}) {
  return (
    <div className="flex gap-6 rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white">
        {number}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
        <div className="mt-3 flex gap-4 text-sm text-gray-500">
          <span>{challenges} challenges</span>
          <span>•</span>
          <span>{points} points</span>
        </div>
      </div>
    </div>
  )
}

function VocabCard({
  term,
  definition,
  example,
}: {
  term: string
  definition: string
  example: string
}) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-primary-600">{term}</h3>
      <p className="mt-2 text-gray-700">{definition}</p>
      <div className="mt-4 rounded bg-gray-50 p-3">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Example:</span> {example}
        </p>
      </div>
    </div>
  )
}