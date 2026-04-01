'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatINR } from '@/utils/format'

interface Insight {
  type: 'warning' | 'tip' | 'achievement'
  icon: string
  title: string
  description: string
  action?: string
}

type ProjectionMode = 'pure_saving' | 'fd' | 'sip'
const FD_RATE = 0.07
const SIP_RATE = 0.12

function projectSavings(monthly: number, years: number, mode: ProjectionMode): number {
  if (monthly <= 0 || years <= 0) return 0
  const n = years * 12
  if (mode === 'pure_saving') return monthly * n
  const r = (mode === 'fd' ? FD_RATE : SIP_RATE) / 12
  // FV of monthly SIP: M × [(1+r)^n - 1] / r × (1+r)
  return monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r))
}

export default function InsightsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [insights, setInsights] = useState<Insight[]>([])
  const [monthlySavings, setMonthlySavings] = useState(5000)
  const [projMode, setProjMode] = useState<ProjectionMode>('pure_saving')

  const loadInsights = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const now = new Date()
    const m = now.getMonth() + 1
    const y = now.getFullYear()
    const monthStart = `${y}-${String(m).padStart(2, '0')}-01`
    const monthEnd = `${y}-${String(m).padStart(2, '0')}-31`

    const { data: txs } = await supabase
      .from('transactions')
      .select('type, amount, category_id, categories(name, icon)')
      .eq('user_id', user.id)
      .gte('date', monthStart)
      .lte('date', monthEnd)

    const { data: budgets } = await supabase
      .from('budgets')
      .select('amount, category_id, categories(name, icon)')
      .eq('user_id', user.id)
      .eq('month', m)
      .eq('year', y)

    let income = 0, expenses = 0
    const catSpend: Record<string, { name: string; icon: string; amount: number }> = {}

    ;(txs ?? []).forEach((t: Record<string, unknown>) => {
      const cat = t.categories as { name: string; icon: string } | null
      if (t.type === 'income') income += Number(t.amount)
      else if (t.type === 'expense') {
        expenses += Number(t.amount)
        const cid = (t.category_id as string) ?? 'other'
        if (!catSpend[cid]) catSpend[cid] = { name: cat?.name ?? 'Other', icon: cat?.icon ?? '📦', amount: 0 }
        catSpend[cid].amount += Number(t.amount)
      }
    })

    const savings = income - expenses
    const savingsRate = income > 0 ? (savings / income) * 100 : 0
    const generated: Insight[] = []

    // Budget overruns
    ;(budgets ?? []).forEach((b: Record<string, unknown>) => {
      const cat = b.categories as { name: string; icon: string } | null
      const catId = b.category_id as string
      const spent = catSpend[catId]?.amount ?? 0
      const budget = Number(b.amount)
      if (spent > budget) {
        const over = spent - budget
        generated.push({
          type: 'warning',
          icon: '⚠️',
          title: `Over budget: ${cat?.icon ?? ''} ${cat?.name ?? 'Category'}`,
          description: `You've spent ${formatINR(spent)} against a budget of ${formatINR(budget)} — that's ${formatINR(over)} (${((over / budget) * 100).toFixed(0)}%) over.`,
          action: `Reducing ${cat?.name ?? 'this category'} to budget would save ${formatINR(over)} this month (${formatINR(over * 12)} per year).`,
        })
      }
    })

    // High savings rate achievement
    if (savingsRate >= 30) {
      generated.push({
        type: 'achievement',
        icon: '🏆',
        title: 'Excellent savings rate!',
        description: `You saved ${savingsRate.toFixed(0)}% of your income this month — ${formatINR(savings)}. That puts you well ahead of the recommended 20%.`,
      })
    } else if (savingsRate >= 20) {
      generated.push({
        type: 'achievement',
        icon: '✅',
        title: 'On track with savings',
        description: `You saved ${savingsRate.toFixed(0)}% of your income — ${formatINR(savings)}. Keep up this habit!`,
      })
    } else if (income > 0) {
      generated.push({
        type: 'tip',
        icon: '💡',
        title: 'Boost your savings rate',
        description: `Your savings rate is ${savingsRate.toFixed(0)}%. Aim for at least 20% — that would be ${formatINR(income * 0.2)} this month.`,
        action: `If you reached 20% savings, in 5 years at FD rates (~7%) you could accumulate approximately ${formatINR(projectSavings(income * 0.2, 5, 'fd'))}.`,
      })
    }

    // Top expense category tip
    const topCat = Object.values(catSpend).sort((a, b) => b.amount - a.amount)[0]
    if (topCat && expenses > 0 && (topCat.amount / expenses) > 0.3) {
      generated.push({
        type: 'tip',
        icon: '🔍',
        title: `High spend: ${topCat.icon} ${topCat.name}`,
        description: `${topCat.name} accounts for ${((topCat.amount / expenses) * 100).toFixed(0)}% of your total expenses this month (${formatINR(topCat.amount)}).`,
        action: `If you reduced this by ₹2,000/month and invested it at SIP returns (~12%), you could gain approximately ${formatINR(projectSavings(2000, 5, 'sip'))} in 5 years.`,
      })
    }

    // Generic tip if no data
    if (generated.length === 0) {
      generated.push({
        type: 'tip',
        icon: '🚀',
        title: 'Start tracking to see insights',
        description: 'Add your income and expense transactions, and set monthly budgets. Personalised insights will appear here automatically.',
      })
    }

    setInsights(generated)
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadInsights() }, [loadInsights])

  const projYears = [1, 3, 5, 10, 20]
  const bgColor = { warning: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800', tip: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800', achievement: 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800' }
  const textColor = { warning: 'text-amber-800 dark:text-amber-300', tip: 'text-blue-800 dark:text-blue-300', achievement: 'text-emerald-800 dark:text-emerald-300' }
  const subColor = { warning: 'text-amber-700 dark:text-amber-400', tip: 'text-blue-700 dark:text-blue-400', achievement: 'text-emerald-700 dark:text-emerald-400' }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Savings Insights</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Personalised observations from your financial data</p>
      </div>

      {/* Insight cards */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((ins, i) => (
            <div key={i} className={`border rounded-2xl p-5 ${bgColor[ins.type]}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{ins.icon}</span>
                <div className="flex-1">
                  <p className={`font-semibold ${textColor[ins.type]}`}>{ins.title}</p>
                  <p className={`text-sm mt-1 ${subColor[ins.type]}`}>{ins.description}</p>
                  {ins.action && (
                    <p className={`text-sm mt-2 font-medium ${subColor[ins.type]}`}>
                      💡 {ins.action}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Savings Projection Calculator */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">Savings Projection</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          Estimate what your regular savings could grow to over time.
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Monthly savings amount (₹)
            </label>
            <div className="relative max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
              <input
                type="number"
                min="100"
                step="100"
                value={monthlySavings}
                onChange={(e) => setMonthlySavings(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {([['pure_saving', '🏦 Pure Saving'], ['fd', '📈 Fixed Deposit (~7% p.a.)'], ['sip', '💹 SIP (~12% p.a.)']] as [ProjectionMode, string][]).map(([mode, label]) => (
              <button
                key={mode}
                onClick={() => setProjMode(mode)}
                className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                  projMode === mode ? 'bg-saffron-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {projYears.map((y) => (
            <div key={y} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-400 mb-1">{y} {y === 1 ? 'year' : 'years'}</p>
              <p className="text-lg font-bold text-saffron-600">{formatINR(projectSavings(monthlySavings, y, projMode))}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <p className="text-xs text-slate-400">
            ⚠️ <strong>Disclaimer:</strong> These are illustrative estimates only, not financial guarantees.
            {projMode === 'fd' && ' Fixed deposit rates (~7%) are assumed and may vary.'}
            {projMode === 'sip' && ' SIP returns (~12%) are illustrative based on long-term historical equity averages. Past performance is not a guarantee of future returns.'}
            {' '}Consult a qualified financial advisor for personalised advice.
          </p>
        </div>
      </div>
    </div>
  )
}
