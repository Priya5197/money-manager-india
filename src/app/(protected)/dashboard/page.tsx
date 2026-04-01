'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatINR, formatDate } from '@/utils/format'
import Link from 'next/link'

interface MonthlyStats {
  income: number
  expenses: number
  savings: number
  savingsRate: number
}

interface RecentTx {
  id: string
  date: string
  type: string
  amount: number
  notes: string | null
  merchant: string | null
  category_name: string | null
  category_icon: string | null
}

interface BudgetItem {
  category_id: string
  category_name: string
  category_icon: string
  budgeted: number
  spent: number
}

interface MonthlyChartPoint {
  month: string
  income: number
  expenses: number
}

function StatCard({
  label, value, sub, trend, color,
}: {
  label: string
  value: string
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
  color?: string
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color ?? 'text-slate-800 dark:text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  )
}

function ProgressBar({ spent, budget }: { spent: number; budget: number }) {
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0
  const color = pct >= 90 ? 'bg-rose-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
  return (
    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function DashboardPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<MonthlyStats>({ income: 0, expenses: 0, savings: 0, savingsRate: 0 })
  const [recentTx, setRecentTx] = useState<RecentTx[]>([])
  const [budgets, setBudgets] = useState<BudgetItem[]>([])
  const [chartData, setChartData] = useState<MonthlyChartPoint[]>([])
  const [userName, setUserName] = useState('')

  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Profile
    const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
    if (profile?.full_name) setUserName(profile.full_name.split(' ')[0])

    // Monthly income/expense
    const monthStart = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`
    const monthEnd = `${currentYear}-${String(currentMonth).padStart(2, '0')}-31`

    const { data: txs } = await supabase
      .from('transactions')
      .select('type, amount, date, notes, merchant, id, categories(name, icon)')
      .eq('user_id', user.id)
      .gte('date', monthStart)
      .lte('date', monthEnd)
      .order('date', { ascending: false })

    let income = 0, expenses = 0
    ;(txs ?? []).forEach((t: Record<string, unknown>) => {
      if (t.type === 'income') income += Number(t.amount)
      else if (t.type === 'expense') expenses += Number(t.amount)
    })
    const savings = income - expenses
    const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0
    setStats({ income, expenses, savings, savingsRate })

    // Recent transactions (last 10)
    const { data: recent } = await supabase
      .from('transactions')
      .select('id, date, type, amount, notes, merchant, categories(name, icon)')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(10)

    setRecentTx(
      (recent ?? []).map((t: Record<string, unknown>) => {
        const cat = t.categories as { name: string; icon: string } | null
        return {
          id: t.id as string,
          date: t.date as string,
          type: t.type as string,
          amount: Number(t.amount),
          notes: t.notes as string | null,
          merchant: t.merchant as string | null,
          category_name: cat?.name ?? null,
          category_icon: cat?.icon ?? null,
        }
      })
    )

    // Budgets with spent
    const { data: budgetRows } = await supabase
      .from('budgets')
      .select('amount, category_id, categories(name, icon)')
      .eq('user_id', user.id)
      .eq('month', currentMonth)
      .eq('year', currentYear)
      .limit(6)

    if (budgetRows?.length) {
      const budgetItems: BudgetItem[] = await Promise.all(
        budgetRows.map(async (b: Record<string, unknown>) => {
          const cat = b.categories as { name: string; icon: string } | null
          const { data: spent } = await supabase
            .from('transactions')
            .select('amount')
            .eq('user_id', user.id)
            .eq('category_id', b.category_id as string)
            .eq('type', 'expense')
            .gte('date', monthStart)
            .lte('date', monthEnd)
          const spentTotal = (spent ?? []).reduce((s: number, t: { amount: number }) => s + Number(t.amount), 0)
          return {
            category_id: b.category_id as string,
            category_name: cat?.name ?? 'Unknown',
            category_icon: cat?.icon ?? '📦',
            budgeted: Number(b.amount),
            spent: spentTotal,
          }
        })
      )
      setBudgets(budgetItems)
    }

    // Last 6 months chart
    const points: MonthlyChartPoint[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1 - i, 1)
      const m = d.getMonth() + 1
      const y = d.getFullYear()
      const mStr = `${y}-${String(m).padStart(2, '0')}`
      const { data: mTxs } = await supabase
        .from('transactions')
        .select('type, amount')
        .eq('user_id', user.id)
        .gte('date', `${mStr}-01`)
        .lte('date', `${mStr}-31`)
      let inc = 0, exp = 0
      ;(mTxs ?? []).forEach((t: { type: string; amount: number }) => {
        if (t.type === 'income') inc += Number(t.amount)
        else if (t.type === 'expense') exp += Number(t.amount)
      })
      points.push({ month: d.toLocaleString('en-IN', { month: 'short' }), income: inc, expenses: exp })
    }
    setChartData(points)
    setLoading(false)
  }, [supabase, currentMonth, currentYear])

  useEffect(() => { load() }, [load])

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 w-56 bg-slate-200 dark:bg-slate-700 rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            {userName ? `Welcome back, ${userName}! 👋` : 'Dashboard'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            {now.toLocaleString('en-IN', { month: 'long', year: 'numeric' })} overview
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/transactions?add=income"
            className="px-4 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
          >
            + Income
          </Link>
          <Link
            href="/transactions?add=expense"
            className="px-4 py-2 text-sm bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-lg transition-colors"
          >
            + Expense
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Income this month" value={formatINR(stats.income)} color="text-emerald-600" />
        <StatCard label="Expenses this month" value={formatINR(stats.expenses)} color="text-rose-600" />
        <StatCard
          label="Net savings"
          value={formatINR(stats.savings)}
          color={stats.savings >= 0 ? 'text-emerald-600' : 'text-rose-600'}
        />
        <StatCard
          label="Savings rate"
          value={`${stats.savingsRate}%`}
          sub={stats.savingsRate >= 20 ? '🎉 Above 20% — great!' : 'Aim for 20%+'}
          color={stats.savingsRate >= 20 ? 'text-emerald-600' : 'text-amber-600'}
        />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart — income vs expense (last 6 months) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <h2 className="text-base font-semibold text-slate-800 dark:text-white mb-4">Income vs Expenses (Last 6 months)</h2>
          {chartData.length > 0 ? (
            <div className="space-y-3">
              {chartData.map((pt) => {
                const maxVal = Math.max(...chartData.map((p) => Math.max(p.income, p.expenses)), 1)
                return (
                  <div key={pt.month} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-10 text-right">{pt.month}</span>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-1">
                        <div
                          className="h-3 bg-emerald-400 rounded-full"
                          style={{ width: `${(pt.income / maxVal) * 100}%`, minWidth: pt.income > 0 ? '4px' : '0' }}
                        />
                        <span className="text-xs text-slate-500 ml-1">{formatINR(pt.income)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div
                          className="h-3 bg-rose-400 rounded-full"
                          style={{ width: `${(pt.expenses / maxVal) * 100}%`, minWidth: pt.expenses > 0 ? '4px' : '0' }}
                        />
                        <span className="text-xs text-slate-500 ml-1">{formatINR(pt.expenses)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div className="flex gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />Income
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />Expenses
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
              Add transactions to see your chart
            </div>
          )}
        </div>

        {/* Budgets */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-800 dark:text-white">Budget Status</h2>
            <Link href="/budgets" className="text-xs text-saffron-600 hover:text-saffron-700 font-medium">
              View all →
            </Link>
          </div>
          {budgets.length > 0 ? (
            <div className="space-y-4">
              {budgets.map((b) => (
                <div key={b.category_id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span>{b.category_icon}</span>
                      {b.category_name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatINR(b.spent)} / {formatINR(b.budgeted)}
                    </span>
                  </div>
                  <ProgressBar spent={b.spent} budget={b.budgeted} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <p className="text-slate-400 text-sm">No budgets set</p>
              <Link href="/budgets" className="mt-2 text-sm text-saffron-600 hover:text-saffron-700 font-medium">
                Set up budgets →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-800 dark:text-white">Recent Transactions</h2>
          <Link href="/transactions" className="text-xs text-saffron-600 hover:text-saffron-700 font-medium">
            View all →
          </Link>
        </div>
        {recentTx.length > 0 ? (
          <div className="space-y-0 divide-y divide-slate-50 dark:divide-slate-800">
            {recentTx.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{tx.category_icon ?? (tx.type === 'income' ? '💰' : '💳')}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {tx.merchant || tx.notes || tx.category_name || 'Transaction'}
                    </p>
                    <p className="text-xs text-slate-400">{formatDate(tx.date)}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'income' ? '+' : '−'}{formatINR(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-slate-400 text-sm">No transactions yet</p>
            <Link href="/transactions?add=expense" className="mt-2 text-sm text-saffron-600 hover:text-saffron-700 font-medium">
              Add your first transaction →
            </Link>
          </div>
        )}
      </div>

      {/* Insight cards */}
      {stats.expenses > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.savingsRate < 20 && (
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-300 text-sm">Savings tip</p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                    Your savings rate is {stats.savingsRate}%. Aim for at least 20% — that&apos;s{' '}
                    {formatINR(stats.income * 0.2)} this month.
                  </p>
                </div>
              </div>
            </div>
          )}
          {stats.savingsRate >= 20 && (
            <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="font-medium text-emerald-800 dark:text-emerald-300 text-sm">Great savings!</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                    You saved {stats.savingsRate}% this month. Keep it up — consistency builds wealth!
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-300 text-sm">EMI check</p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                  Planning a loan? Use our{' '}
                  <Link href="/calculators/emi" className="underline hover:text-blue-600">
                    EMI Calculator
                  </Link>{' '}
                  to see what fits your budget.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
