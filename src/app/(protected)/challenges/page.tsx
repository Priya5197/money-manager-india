'use client'

import { useState } from 'react'
import { formatINR } from '@/utils/format'

// ─── Feature H: Savings Challenges — Extendable Architecture Stub ─────────────
// Future extensions:
//  • Progress tracked against actual transaction data
//  • Custom challenge creation
//  • Community challenges and leaderboards (opt-in)
//  • Streak tracking with rewards/badges
//  • Social sharing (opt-in)

interface Challenge {
  id: string
  title: string
  description: string
  targetAmount: number
  durationDays: number
  category: string
  icon: string
  difficulty: 'easy' | 'medium' | 'hard'
  joined: boolean
  progress: number  // 0–100
}

const CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: '52-Week Challenge',
    description: 'Save ₹100 in week 1, ₹200 in week 2, and so on. By week 52, you\'ll have saved ₹1,37,800!',
    targetAmount: 137800,
    durationDays: 365,
    category: 'Savings',
    icon: '📅',
    difficulty: 'medium',
    joined: true,
    progress: 23,
  },
  {
    id: '2',
    title: 'No-Spend Weekend',
    description: 'Commit to spending ₹0 on non-essentials for one weekend every month. Small discipline, big results.',
    targetAmount: 3000,
    durationDays: 30,
    category: 'Spending',
    icon: '🚫',
    difficulty: 'easy',
    joined: false,
    progress: 0,
  },
  {
    id: '3',
    title: '₹10,000 in 30 Days',
    description: 'Find ways to save or earn an extra ₹10,000 in one month — reduce eating out, sell unused items, etc.',
    targetAmount: 10000,
    durationDays: 30,
    category: 'Savings',
    icon: '💪',
    difficulty: 'medium',
    joined: false,
    progress: 0,
  },
  {
    id: '4',
    title: 'Coffee & Snacks Detox',
    description: 'Skip outside coffee and snacks for 21 days. Most people save ₹2,000–₹4,000 doing this.',
    targetAmount: 3000,
    durationDays: 21,
    category: 'Spending',
    icon: '☕',
    difficulty: 'easy',
    joined: true,
    progress: 57,
  },
  {
    id: '5',
    title: 'SIP Starter',
    description: 'Start a SIP of any amount (even ₹500) and keep it running for 3 months without stopping.',
    targetAmount: 1500,
    durationDays: 90,
    category: 'Investing',
    icon: '📈',
    difficulty: 'easy',
    joined: false,
    progress: 0,
  },
  {
    id: '6',
    title: '₹1 Lakh Emergency Fund',
    description: 'Build a ₹1,00,000 emergency fund over 12 months. Save ₹8,333/month to hit the target.',
    targetAmount: 100000,
    durationDays: 365,
    category: 'Savings',
    icon: '🚨',
    difficulty: 'hard',
    joined: false,
    progress: 0,
  },
]

const DIFFICULTY_STYLES = {
  easy: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400',
  medium: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400',
  hard: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400',
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>(CHALLENGES)
  const [filter, setFilter] = useState<'all' | 'joined' | 'available'>('all')

  const toggleJoin = (id: string) =>
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, joined: !c.joined, progress: !c.joined ? 0 : c.progress } : c))
    )

  const filtered = challenges.filter((c) => {
    if (filter === 'joined') return c.joined
    if (filter === 'available') return !c.joined
    return true
  })

  const joinedChallenges = challenges.filter((c) => c.joined)
  const totalTargetSaving = joinedChallenges.reduce((s, c) => s + c.targetAmount, 0)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Savings Challenges</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          Fun, structured challenges to build saving habits one step at a time
        </p>
      </div>

      {/* Coming soon badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-700 rounded-full text-xs font-semibold text-amber-700 dark:text-amber-400">
        <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
        Preview Mode — Progress tracking &amp; badges coming soon
      </div>

      {/* Active challenge summary */}
      {joinedChallenges.length > 0 && (
        <div className="bg-gradient-to-br from-saffron-500 to-orange-500 rounded-2xl p-5 text-white">
          <p className="text-sm font-medium text-orange-100">Active challenges</p>
          <p className="text-3xl font-black mt-0.5">{joinedChallenges.length}</p>
          <p className="text-orange-100 text-sm mt-1">
            Combined saving target: <strong>{formatINR(totalTargetSaving)}</strong>
          </p>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'joined', 'available'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
              filter === f
                ? 'bg-saffron-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Challenge cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((challenge) => (
          <div
            key={challenge.id}
            className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 transition-all ${
              challenge.joined
                ? 'border-saffron-200 dark:border-saffron-800 shadow-sm'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{challenge.icon}</span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white text-sm">{challenge.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_STYLES[challenge.difficulty]}`}>
                      {challenge.difficulty}
                    </span>
                    <span className="text-xs text-slate-400">{challenge.durationDays} days</span>
                  </div>
                </div>
              </div>
              {challenge.joined && (
                <span className="text-xs px-2 py-1 bg-saffron-100 dark:bg-saffron-950 text-saffron-700 dark:text-saffron-400 rounded-full font-medium">
                  Active
                </span>
              )}
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{challenge.description}</p>

            {/* Progress */}
            {challenge.joined && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Progress</span>
                  <span>{challenge.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-saffron-500 rounded-full transition-all"
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Target</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{formatINR(challenge.targetAmount)}</p>
              </div>
              <button
                onClick={() => toggleJoin(challenge.id)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                  challenge.joined
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600'
                    : 'bg-saffron-500 hover:bg-saffron-600 text-white'
                }`}
              >
                {challenge.joined ? 'Leave' : 'Join Challenge'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming features */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-3">What&apos;s coming</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: '🏅', text: 'Earn badges for completing challenges and maintaining streaks' },
            { icon: '📊', text: 'Auto-progress tracking linked to your real transactions' },
            { icon: '👥', text: 'Opt-in community challenges — see how others are doing (anonymised)' },
            { icon: '✏️', text: 'Create custom challenges tailored to your own savings goals' },
          ].map((f) => (
            <div key={f.text} className="flex gap-2 items-start p-3 bg-slate-50 dark:bg-slate-800 rounded-xl opacity-70">
              <span>{f.icon}</span>
              <p className="text-sm text-slate-600 dark:text-slate-400">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
