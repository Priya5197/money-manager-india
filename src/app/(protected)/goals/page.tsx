'use client'

// ─── Feature H: Goals — Extendable Architecture Stub ──────────────────────────
// This module is designed to be extended with:
//  • Goal creation (target amount, target date, category)
//  • Progress tracking linked to savings/transactions
//  • Milestone notifications
//  • Shared goals for family budgets
//  • Goal categories: Emergency Fund, Vacation, Home Down Payment, Education, etc.

export default function GoalsPage() {
  const upcomingFeatures = [
    {
      icon: '🎯',
      title: 'Smart Goal Creation',
      description: 'Set financial goals with target amounts and dates. The app will calculate how much you need to save monthly to reach them.',
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Visual progress bars linked to your actual savings and transactions — see how close you are to each goal in real time.',
    },
    {
      icon: '🔔',
      title: 'Milestone Notifications',
      description: 'Get notified when you hit 25%, 50%, 75%, and 100% of a goal. Celebrate your milestones!',
    },
    {
      icon: '👨‍👩‍👧',
      title: 'Family / Shared Goals',
      description: 'Collaborate on savings goals with a partner or family members — see combined contributions toward shared targets.',
    },
    {
      icon: '🏠',
      title: 'Common Goal Templates',
      description: 'Start quickly with templates: Emergency Fund (3–6 months expenses), Home Down Payment, Vacation Fund, Child\'s Education, and more.',
    },
    {
      icon: '🔄',
      title: 'Auto-allocation',
      description: 'Connect a savings account and automatically allocate a percentage of each income transaction toward your active goals.',
    },
  ]

  const goalCategories = [
    { icon: '🚨', label: 'Emergency Fund' },
    { icon: '🏠', label: 'Home Down Payment' },
    { icon: '✈️', label: 'Vacation' },
    { icon: '🎓', label: 'Education' },
    { icon: '🚗', label: 'Vehicle' },
    { icon: '💍', label: 'Wedding' },
    { icon: '👴', label: 'Retirement' },
    { icon: '🎯', label: 'Custom Goal' },
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Goals</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          Set, track, and achieve your financial goals
        </p>
      </div>

      {/* Coming soon banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-blue-900 to-navy-800 rounded-2xl p-8 text-white">
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-saffron-500 text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wide">
            Coming Soon
          </span>
          <h2 className="text-2xl font-bold mb-2">Goals are on the way!</h2>
          <p className="text-blue-200 text-sm max-w-lg">
            We&apos;re building a comprehensive goals engine that connects your income, spending, and savings into a single unified picture. Stay tuned for the launch.
          </p>
        </div>
        <span className="absolute right-6 top-6 text-8xl opacity-10">🎯</span>
      </div>

      {/* Goal categories preview */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Goal categories we&apos;re planning</h3>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {goalCategories.map((cat) => (
            <div
              key={cat.label}
              className="flex flex-col items-center gap-1.5 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl opacity-60 cursor-not-allowed"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs text-slate-600 dark:text-slate-400 text-center leading-tight">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming features */}
      <div className="grid sm:grid-cols-2 gap-4">
        {upcomingFeatures.map((f) => (
          <div
            key={f.title}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 opacity-75"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="font-semibold text-slate-800 dark:text-white text-sm">{f.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{f.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Architecture note */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          <strong>Architecture:</strong> This module is scaffolded in the routing tree and ready for feature development.
          Goal data will be stored in the <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">goals</code> Supabase table with
          RLS policies per user. Progress will be computed via a server function joining goals with transactions and accounts.
        </p>
      </div>
    </div>
  )
}
