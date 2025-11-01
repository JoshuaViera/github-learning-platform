import Link from 'next/link'
import { ArrowRight, Code2, GitBranch, Trophy, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <GitBranch className="h-6 w-6 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Git Learning Platform</span>
          </div>
          <Link
            href="/login"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
            Master Git & GitHub
            <span className="block text-primary-600">Through Practice</span>
          </h1>
          <p className="mb-8 text-xl text-gray-600 md:text-2xl">
            Interactive challenges designed for Pursuit students. Learn Git commands, branching
            strategies, and collaboration workflows in a safe, simulated environment.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-primary-700 hover:scale-105"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-900 transition-all hover:border-gray-400 hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
            Why Learn Here?
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Code2 className="h-8 w-8" />}
              title="Interactive Terminal"
              description="Practice Git commands in a real terminal environment with instant feedback."
            />
            <FeatureCard
              icon={<GitBranch className="h-8 w-8" />}
              title="Visual Git Tree"
              description="See your commits, branches, and merges visualized in real-time."
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8" />}
              title="Progressive Hints"
              description="Get unstuck with progressive hints that guide without giving away the answer."
            />
            <FeatureCard
              icon={<Trophy className="h-8 w-8" />}
              title="Track Progress"
              description="Earn achievements, maintain streaks, and get certificates upon completion."
            />
          </div>
        </div>
      </section>

      {/* Learning Path Preview */}
      <section className="border-t bg-gradient-to-br from-blue-50 to-green-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
            Your Learning Path
          </h2>
          <div className="mx-auto max-w-3xl space-y-6">
            <PathStep number={1} title="Git Basics" description="Initialize repos, make commits, understand the staging area" />
            <PathStep number={2} title="Branching & Merging" description="Create branches, merge changes, resolve conflicts" />
            <PathStep number={3} title="Remote Collaboration" description="Push, pull, fork, and create pull requests" />
            <PathStep number={4} title="Advanced Workflows" description="Rebase, cherry-pick, and team collaboration strategies" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-primary-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold">Ready to Become a Git Expert?</h2>
          <p className="mb-8 text-xl text-primary-100">
            Join your Pursuit classmates and start learning today.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-primary-600 transition-all hover:bg-gray-100 hover:scale-105"
          >
            Sign In with Pursuit Email
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>
            Built with love for Pursuit Students by Joshua Viera
          </p>
          <p className="mt-2 text-sm">2025 GitHub Learning Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 inline-flex rounded-lg bg-primary-100 p-3 text-primary-600">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function PathStep({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white">
        {number}
      </div>
      <div>
        <h3 className="mb-1 text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}