'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatINR } from '@/utils/format'

interface Category { id: string; name: string; icon: string; type: string }
interface BudgetRow {
  id: string
  category_id: string | null
  category_name: string
  category_icon: string
  budgeted: number
  spent: number
  month: number
  year: number
}

export default function BudgetsPage() {
  const supabase = createClient()
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [budgets, setBudgets] = useState<BudgetRow[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formCatId, setFormCatId] = useState('')
  const [formAmount, setFormAmount] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editBudget, setEditBudget] = useState<BudgetRow | null>(null)

  const monthStart = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`
  const monthEnd = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-31`

  const loadData = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [{ data: catData }, { data: budgetData }] = await Promise.all([
      supabase.from('categories').select('id, name, icon, type')
        .or(`user_id.eq.${user.id},user_id.is.null`)
        .eq('type', 'expense')
        .eq('is_archived', false)
        .order('name'),
      supabase.from('budgets').select('id, category_id, amount, month, year, categories(name, icon)')
        .eq('user_id', user.id)
        .eq('month', selectedMonth)
        .eq('year', selectedYear),
    ])

    setCategories(catData ?? [])

    const rows: BudgetRow[] = await Promise.all(
      (budgetData ?? []).map(async (b: Record<string, unknown>) => {
        const cat = b.categories as { name: string; icon: string } | null
        const { data: txData } = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', user.id)
          .eq('category_id', b.category_id as string)
          .eq('type', 'expense')
          .gte('date', monthStart)
          .lte('date', monthEnd)

        const spent = (txData ?? []).reduce((s: number, t: { amount: number }) => s + Number(t.amount), 0)
        return {
          id: b.id as string,
          category_id: b.category_id as string | null,
          category_name: cat?.name ?? 'Unknown',
          category_icon: cat?.icon ?? '📦',
          budgeted: Number(b.amount),
          spent,
          month: b.month as number,
          year: b.year as number,
        }
      })
    )

    setBudgets(rows)
    setLoading(false)
  }, [supabase, selectedMonth, selectedYear, monthStart, monthEnd])

  useEffect(() => { loadData() }, [loadData])

  const totalBudgeted = budgets.reduce((s, b) => s + b.budgeted, 0)
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0)
  const overBudget = budgets.filter((b) => b.spent > b.budgeted)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(formAmount)
    if (!formCatId || isNaN(amt) || amt <= 0) return
    setFormLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (editBudget) {
      await supabase.from('budgets').update({ amount: amt }).eq('id', editBudget.id)
    } else {
      await supabase.from('budgets').upsert({
        user_id: user.id, category_id: formCatId, amount: amt,
        month: selectedMonth, year: selectedYear,
      }, { onConflict: 'user_id,category_id,month,year' })
    }
    setShowForm(false)
    setEditBudget(null)
    setFormCatId('')
    setFormAmount('')
    setFormLoading(false)
    loadData()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await supabase.from('budgets').delete().eq('id', deleteId)
    setDeleteId(null)
    loadData()
  }

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const YEARS = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1]

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Budgets</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Plan and track your monthly spending</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
          >
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
          >
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <button
            onClick={() => { setEditBudget(null); setFormCatId(''); setFormAmount(''); setShowForm(true) }}
            className="px-4 py-2 text-sm bg-saffron-500 hover:bg-saffron-600 text-white font-semibold rounded-lg transition-colors"
          >
            + Set Budget
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Budget</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{formatINR(totalBudgeted)}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Spent</p>
          <p className={`text-2xl font-bold mt-1 ${totalSpent > totalBudgeted ? 'text-rose-600' : 'text-emerald-600'}`}>
            {formatINR(totalSpent)}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">Remaining</p>
          <p className={`text-2xl font-bold mt-1 ${totalBudgeted - totalSpent < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {formatINR(Math.max(0, totalBudgeted - totalSpent))}
          </p>
        </div>
      </div>

      {overBudget.length > 0 && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 rounded-xl">
          <p className="text-sm font-medium text-rose-700 dark:text-rose-400">
            ⚠️ Over budget in {overBudget.length} {overBudget.length === 1 ? 'category' : 'categories'}:{' '}
            {overBudget.map((b) => `${b.category_icon} ${b.category_name}`).join(', ')}
          </p>
        </div>
      )}

      {/* Budget cards */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-36 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-16 text-center">
          <p className="text-4xl mb-3">📊</p>
          <p className="font-medium text-slate-700 dark:text-slate-300">No budgets for this month</p>
          <p className="text-sm text-slate-400 mt-1 mb-4">Set budgets to track your spending against goals</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white font-medium rounded-lg transition-colors"
          >
            Set your first budget
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => {
            const pct = b.budgeted > 0 ? Math.min((b.spent / b.budgeted) * 100, 100) : 0
            const over = b.spent > b.budgeted
            const barColor = over ? 'bg-rose-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
            return (
              <div
                key={b.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 ${
                  over ? 'border-rose-300 dark:border-rose-700' : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{b.category_icon}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">{b.category_name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditBudget(b); setFormCatId(b.category_id ?? ''); setFormAmount(b.budgeted.toString()); setShowForm(true) }}
                      className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(b.id)}
                      className="text-xs text-rose-400 hover:text-rose-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={over ? 'text-rose-600 font-semibold' : 'text-slate-500 dark:text-slate-400'}>
                      {formatINR(b.spent)} spent
                    </span>
                    <span className="text-slate-400 text-xs">{Math.round(pct)}%</span>
                    <span className="text-slate-500 dark:text-slate-400">{formatINR(b.budgeted)} budget</span>
                  </div>
                  {over && (
                    <p className="text-xs text-rose-600">
                      Over by {formatINR(b.spent - b.budgeted)}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Budget modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-5">
              {editBudget ? 'Edit Budget' : 'Set Budget'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              {!editBudget && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={formCatId}
                    onChange={(e) => setFormCatId(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  >
                    <option value="">— Select expense category —</option>
                    {categories
                      .filter((c) => !budgets.some((b) => b.category_id === c.id))
                      .map((c) => (
                        <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                      ))}
                  </select>
                </div>
              )}
              {editBudget && (
                <p className="text-sm text-slate-500">
                  Editing budget for <strong>{editBudget.category_icon} {editBudget.category_name}</strong>
                </p>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Budget (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    required
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500 text-lg font-semibold"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditBudget(null) }}
                  className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-2.5 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-60 text-white font-semibold rounded-xl"
                >
                  {formLoading ? 'Saving…' : 'Save budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Delete budget?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">This will remove the budget limit for this category.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
