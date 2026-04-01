'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatINR, formatPercent } from '@/utils/format'
import Link from 'next/link'

type Tab = 'overview' | 'expenses' | 'budget' | 'trends'
type Preset = 'this_month' | 'last_month' | 'last_3' | 'last_6' | 'this_year' | 'custom'

interface CategorySpend { name: string; icon: string; amount: number; pct: number }
interface MonthPoint { label: string; income: number; expenses: number; savings: number }
interface BudgetComp { name: string; icon: string; budgeted: number; spent: number }

function getDateRange(preset: Preset, customFrom: string, customTo: string): { from: string; to: string } {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth() + 1
  const pad = (n: number) => String(n).padStart(2, '0')

  switch (preset) {
    case 'this_month':
      return { from: `${y}-${pad(m)}-01`, to: `${y}-${pad(m)}-31` }
    case 'last_month': {
      const d = new Date(y, m - 2, 1)
      return { from: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`, to: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-31` }
    }
    case 'last_3': {
      const d = new Date(y, m - 4, 1)
      return { from: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`, to: `${y}-${pad(m)}-31` }
    }
    case 'last_6': {
      const d = new Date(y, m - 7, 1)
      return { from: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`, to: `${y}-${pad(m)}-31` }
    }
    case 'this_year':
      return { from: `${y}-01-01`, to: `${y}-12-31` }
    case 'custom':
      return { from: customFrom, to: customTo }
    default:
      return { from: `${y}-${pad(m)}-01`, to: `${y}-${pad(m)}-31` }
  }
}

export default function ReportsPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [preset, setPreset] = useState<Preset>('this_month')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [loading, setLoading] = useState(true)

  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategorySpend[]>([])
  const [monthlyPoints, setMonthlyPoints] = useState<MonthPoint[]>([])
  const [budgetComparison, setBudgetComparison] = useState<BudgetComp[]>([])

  const { from, to } = getDateRange(preset, customFrom, customTo)

  const loadData = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Transactions in range
    const { data: txs } = await supabase
      .from('transactions')
      .select('type, amount, date, category_id, categories(name, icon)')
      .eq('user_id', user.id)
      .gte('date', from)
      .lte('date', to)

    let income = 0, expenses = 0
    const catMap: Record<string, { name: string; icon: string; amount: number }> = {}

    ;(txs ?? []).forEach((t: Record<string, unknown>) => {
      const cat = t.categories as { name: string; icon: string } | null
      if (t.type === 'income') income += Number(t.amount)
      else if (t.type === 'expense') {
        expenses += Number(t.amount)
        const catId = (t.category_id as string) ?? 'uncategorized'
        if (!catMap[catId]) catMap[catId] = { name: cat?.name ?? 'Uncategorized', icon: cat?.icon ?? '📦', amount: 0 }
        catMap[catId].amount += Number(t.amount)
      }
    })
    setTotalIncome(income)
    setTotalExpenses(expenses)

    const breakdown = Object.values(catMap)
      .sort((a, b) => b.amount - a.amount)
      .map((c) => ({ ...c, pct: expenses > 0 ? (c.amount / expenses) * 100 : 0 }))
    setCategoryBreakdown(breakdown)

    // Monthly trend (last 6 months)
    const points: MonthPoint[] = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const ms = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const { data: mTxs } = await supabase
        .from('transactions')
        .select('type, amount')
        .eq('user_id', user.id)
        .gte('date', `${ms}-01`)
        .lte('date', `${ms}-31`)
      let inc = 0, exp = 0
      ;(mTxs ?? []).forEach((t: { type: string; amount: number }) => {
        if (t.type === 'income') inc += Number(t.amount)
        else if (t.type === 'expense') exp += Number(t.amount)
      })
      points.push({ label: d.toLocaleString('en-IN', { month: 'short', year: '2-digit' }), income: inc, expenses: exp, savings: inc - exp })
    }
    setMonthlyPoints(points)

    // Budget comparison for current month
    const now2 = new Date()
    const { data: budgets } = await supabase
      .from('budgets')
      .select('category_id, amount, categories(name, icon)')
      .eq('user_id', user.id)
      .eq('month', now2.getMonth() + 1)
      .eq('year', now2.getFullYear())

    const budgetItems: BudgetComp[] = await Promise.all(
      (budgets ?? []).map(async (b: Record<string, unknown>) => {
        const cat = b.categories as { name: string; icon: string } | null
        const { data: spentData } = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', user.id)
          .eq('category_id', b.category_id as string)
          .eq('type', 'expense')
          .gte('date', `${now2.getFullYear()}-${String(now2.getMonth() + 1).padStart(2, '0')}-01`)
          .lte('date', `${now2.getFullYear()}-${String(now2.getMonth() + 1).padStart(2, '0')}-31`)
        const spent = (spentData ?? []).reduce((s: number, t: { amount: number }) => s + Number(t.amount), 0)
        return { name: cat?.name ?? 'Unknown', icon: cat?.icon ?? '📦', budgeted: Number(b.amount), spent }
      })
    )
    setBudgetComparison(budgetItems)
    setLoading(false)
  }, [supabase, from, to])

  useEffect(() => { loadData() }, [loadData])

  const savings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0

  const exportCSV = () => {
    const rows = categoryBreakdown.map((c) => `${c.name},${c.amount.toFixed(2)},${c.pct.toFixed(1)}%`)
    const csv = ['Category,Amount,% of Total', ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `report_${from}_to_${to}.csv`
    a.click()
  }

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview' },
    { id: 'expenses' as Tab, label: 'Expenses' },
    { id: 'budget' as Tab, label: 'Budget Analysis' },
    { id: 'trends' as Tab, label: 'Trends' },
  ]

  const presets: { id: Preset; label: string }[] = [
    { id: 'this_month', label: 'This month' },
    { id: 'last_month', label: 'Last month' },
    { id: 'last_3', label: '3 months' },
    { id: 'last_6', label: '6 months' },
    { id: 'this_year', label: 'This year' },
    { id: 'custom', label: 'Custom' },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Reports & Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Understand your financial patterns</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            ⬇ Export CSV
          </button>
          <Link href="/reports/insights" className="px-4 py-2 text-sm bg-saffron-500 hover:bg-saffron-600 text-white font-medium rounded-lg transition-colors">
            💡 View Insights
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => setPreset(p.id)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                preset === p.id
                  ? 'bg-saffron-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
          {preset === 'custom' && (
            <div className="flex gap-2 mt-2 w-full">
              <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)}
                className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500" />
              <span className="text-slate-400 self-center">to</span>
              <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)}
                className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500" />
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === t.id
                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                  <p className="text-sm text-slate-500">Total Income</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{formatINR(totalIncome)}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                  <p className="text-sm text-slate-500">Total Expenses</p>
                  <p className="text-2xl font-bold text-rose-600 mt-1">{formatINR(totalExpenses)}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                  <p className="text-sm text-slate-500">Net Savings</p>
                  <p className={`text-2xl font-bold mt-1 ${savings >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{formatINR(savings)}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                  <p className="text-sm text-slate-500">Savings Rate</p>
                  <p className={`text-2xl font-bold mt-1 ${savingsRate >= 20 ? 'text-emerald-600' : 'text-amber-600'}`}>{formatPercent(savingsRate)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Expenses Tab */}
          {activeTab === 'expenses' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5">Category Breakdown</h2>
              {categoryBreakdown.length === 0 ? (
                <p className="text-slate-400 text-center py-10">No expense data for this period</p>
              ) : (
                <div className="space-y-3">
                  {categoryBreakdown.slice(0, 15).map((c, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span>{c.icon}</span>{c.name}
                        </span>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{formatINR(c.amount)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-saffron-400 rounded-full" style={{ width: `${c.pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-400 w-12 text-right">{c.pct.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Budget Analysis Tab */}
          {activeTab === 'budget' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5">Budget vs Actual (Current Month)</h2>
              {budgetComparison.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-400 mb-3">No budgets set for current month</p>
                  <Link href="/budgets" className="text-saffron-600 hover:text-saffron-700 font-medium text-sm">Set up budgets →</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {budgetComparison.map((b, i) => {
                    const pct = b.budgeted > 0 ? (b.spent / b.budgeted) * 100 : 0
                    const over = b.spent > b.budgeted
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{b.icon} {b.name}</span>
                          <span className={`text-sm font-semibold ${over ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {formatINR(b.spent)} / {formatINR(b.budgeted)}
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${over ? 'bg-rose-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {over ? `Over by ${formatINR(b.spent - b.budgeted)}` : `${formatINR(b.budgeted - b.spent)} remaining (${(100 - pct).toFixed(0)}%)`}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5">6-Month Trend</h2>
              <div className="space-y-4">
                {monthlyPoints.map((pt, i) => {
                  const maxVal = Math.max(...monthlyPoints.map((p) => Math.max(p.income, p.expenses)), 1)
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 w-14 flex-shrink-0">{pt.label}</span>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="h-3 bg-emerald-400 rounded-full min-w-0" style={{ width: `${(pt.income / maxVal) * 100}%` }} />
                          <span className="text-xs text-slate-500 whitespace-nowrap">{formatINR(pt.income)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 bg-rose-400 rounded-full min-w-0" style={{ width: `${(pt.expenses / maxVal) * 100}%` }} />
                          <span className="text-xs text-slate-500 whitespace-nowrap">{formatINR(pt.expenses)}</span>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold w-20 text-right ${pt.savings >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {pt.savings >= 0 ? '+' : ''}{formatINR(pt.savings)}
                      </span>
                    </div>
                  )
                })}
                <div className="flex gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-3 rounded-full bg-emerald-400" />Income</span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-3 rounded-full bg-rose-400" />Expenses</span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-3 rounded-full bg-slate-400" />Net savings</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
