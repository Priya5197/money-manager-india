'use client'

import { useState, useMemo } from 'react'
import { formatINR } from '@/utils/format'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SpendingItem {
  id: string
  category: string
  monthlyAmount: number
  budgetLimit: number
  isDiscretionary: boolean
}

type ProjectionMode = 'pure_saving' | 'fd' | 'sip'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DEFAULT_ITEMS: SpendingItem[] = [
  { id: '1', category: 'Dining & Restaurants', monthlyAmount: 4500, budgetLimit: 3000, isDiscretionary: true },
  { id: '2', category: 'Entertainment & OTT', monthlyAmount: 1800, budgetLimit: 1500, isDiscretionary: true },
  { id: '3', category: 'Online Shopping', monthlyAmount: 6000, budgetLimit: 4000, isDiscretionary: true },
  { id: '4', category: 'Groceries', monthlyAmount: 8000, budgetLimit: 9000, isDiscretionary: false },
  { id: '5', category: 'Transport & Fuel', monthlyAmount: 3200, budgetLimit: 3500, isDiscretionary: false },
  { id: '6', category: 'Subscriptions', monthlyAmount: 1400, budgetLimit: 800, isDiscretionary: true },
]

function calcProjection(monthly: number, years: number, mode: ProjectionMode) {
  if (monthly <= 0 || years <= 0) return { futureValue: 0, totalContribution: 0, interest: 0, rate: 0, disclaimer: '' }

  const totalContribution = monthly * 12 * years
  let futureValue = totalContribution
  let rate = 0
  let disclaimer = ''

  if (mode === 'pure_saving') {
    rate = 0
    futureValue = totalContribution
    disclaimer = 'Simple accumulation — no interest or market returns assumed. Actual value depends on where you keep the money.'
  } else if (mode === 'fd') {
    rate = 6.5
    const r = rate / 100 / 12
    let fv = 0
    for (let m = 0; m < 12 * years; m++) {
      fv = (fv + monthly) * (1 + r)
    }
    futureValue = Math.round(fv)
    disclaimer = `Illustrative estimate using a 6.5% p.a. FD rate (compounded monthly). Actual FD rates vary by bank and tenure. This is an estimate, not a guaranteed return.`
  } else {
    rate = 12
    const r = rate / 100 / 12
    const n = 12 * years
    futureValue = Math.round((monthly * ((Math.pow(1 + r, n) - 1) / r)) * (1 + r))
    disclaimer = `Illustrative SIP estimate using 12% p.a. historical equity market average. Markets are volatile — past performance does not guarantee future returns. This is an estimate for planning purposes only.`
  }

  return {
    futureValue,
    totalContribution,
    interest: futureValue - totalContribution,
    rate,
    disclaimer,
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SavingsGuidancePage() {
  const [items, setItems] = useState<SpendingItem[]>(DEFAULT_ITEMS)
  const [newCategory, setNewCategory] = useState('')
  const [mode, setMode] = useState<ProjectionMode>('pure_saving')
  const [projYears, setProjYears] = useState(5)
  const [showAddRow, setShowAddRow] = useState(false)

  // ── Spending analysis ──────────────────────────────────────────────────────
  const analysis = useMemo(() => {
    const overBudget = items.filter((i) => i.monthlyAmount > i.budgetLimit)
    const discretionaryOver = items.filter((i) => i.isDiscretionary && i.monthlyAmount > i.budgetLimit)
    const wellManaged = items.filter((i) => i.monthlyAmount <= i.budgetLimit * 0.8 && i.monthlyAmount > 0)

    const potentialMonthlySaving = overBudget.reduce(
      (sum, i) => sum + (i.monthlyAmount - i.budgetLimit),
      0
    )

    return { overBudget, discretionaryOver, wellManaged, potentialMonthlySaving }
  }, [items])

  // ── Projection ────────────────────────────────────────────────────────────
  const projection = useMemo(
    () => calcProjection(analysis.potentialMonthlySaving, projYears, mode),
    [analysis.potentialMonthlySaving, projYears, mode]
  )

  // ── Edits ─────────────────────────────────────────────────────────────────
  const updateItem = (id: string, field: keyof SpendingItem, value: number | string | boolean) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const addItem = () => {
    if (!newCategory.trim()) return
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        category: newCategory.trim(),
        monthlyAmount: 0,
        budgetLimit: 0,
        isDiscretionary: true,
      },
    ])
    setNewCategory('')
    setShowAddRow(false)
  }

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id))

  const modeLabels: Record<ProjectionMode, { label: string; icon: string; color: string }> = {
    pure_saving: { label: 'Pure Saving', icon: '🏦', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
    fd: { label: 'FD Estimate', icon: '📈', color: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300' },
    sip: { label: 'SIP Estimate', icon: '📊', color: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' },
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Savings Guidance</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          Spot areas where small adjustments can make a big difference over time
        </p>
      </div>

      {/* Positive intro message */}
      <div className="p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl flex gap-3">
        <span className="text-2xl">💚</span>
        <div>
          <p className="font-semibold text-emerald-800 dark:text-emerald-200 text-sm">You're already doing great by reviewing your spending!</p>
          <p className="text-emerald-700 dark:text-emerald-400 text-sm mt-0.5">
            This tool gently highlights areas where small changes could free up money for your goals — without judgment. Every rupee counts.
          </p>
        </div>
      </div>

      {/* Spending table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="font-semibold text-slate-800 dark:text-white">Monthly Spending</h2>
            <p className="text-xs text-slate-400 mt-0.5">Enter your actual spending and the budget you'd like to stay within</p>
          </div>
          <button
            onClick={() => setShowAddRow(true)}
            className="px-3 py-1.5 text-sm bg-saffron-500 hover:bg-saffron-600 text-white font-medium rounded-lg transition-colors"
          >
            + Add Category
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Actual (₹/mo)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Budget (₹/mo)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Type</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {items.map((item) => {
                const diff = item.monthlyAmount - item.budgetLimit
                const pct = item.budgetLimit > 0 ? (item.monthlyAmount / item.budgetLimit) * 100 : 0
                const isOver = diff > 0
                return (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{item.category}</td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={item.monthlyAmount || ''}
                          onChange={(e) => updateItem(item.id, 'monthlyAmount', Number(e.target.value))}
                          className="w-28 pl-6 pr-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={item.budgetLimit || ''}
                          onChange={(e) => updateItem(item.id, 'budgetLimit', Number(e.target.value))}
                          className="w-28 pl-6 pr-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {item.budgetLimit > 0 && item.monthlyAmount > 0 ? (
                        <div className="flex flex-col gap-0.5">
                          <span className={`text-xs font-medium ${isOver ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {isOver ? `Over by ${formatINR(diff)}` : `${Math.round(100 - pct)}% under budget`}
                          </span>
                          <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct > 100 ? 'bg-rose-500' : pct > 85 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => updateItem(item.id, 'isDiscretionary', !item.isDiscretionary)}
                        className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${item.isDiscretionary ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                      >
                        {item.isDiscretionary ? 'Discretionary' : 'Essential'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-rose-400 text-xs transition-colors">✕</button>
                    </td>
                  </tr>
                )
              })}

              {/* Add row inline */}
              {showAddRow && (
                <tr className="bg-saffron-50 dark:bg-saffron-950/20">
                  <td className="px-4 py-3" colSpan={5}>
                    <input
                      autoFocus
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addItem()}
                      placeholder="e.g. Gym membership, Coffee, Clothing…"
                      className="w-full px-3 py-2 border border-saffron-300 dark:border-saffron-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                    />
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={addItem} className="text-xs px-2 py-1 bg-saffron-500 text-white rounded-lg">Add</button>
                    <button onClick={() => setShowAddRow(false)} className="text-xs px-2 py-1 text-slate-500 hover:text-slate-700">Cancel</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      {analysis.overBudget.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-slate-800 dark:text-white text-lg">Personalised Insights</h2>

          {analysis.overBudget.map((item) => {
            const overage = item.monthlyAmount - item.budgetLimit
            const yearlyRetained = overage * 12
            return (
              <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{item.isDiscretionary ? '💡' : '📌'}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 dark:text-white">{item.category}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      You're spending <strong>{formatINR(item.monthlyAmount)}/month</strong> — about{' '}
                      <strong>{formatINR(overage)} over</strong> your {formatINR(item.budgetLimit)} budget.
                      That's a small gap, and it's completely normal!
                    </p>
                    <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900 rounded-xl text-sm">
                      <p className="text-emerald-700 dark:text-emerald-400">
                        <span className="font-semibold">If you brought {item.category} spending back to budget:</span>{' '}
                        you could redirect <strong>{formatINR(overage)}/month</strong> to savings.
                        Over a year, that's <strong className="text-emerald-600">{formatINR(yearlyRetained)} retained</strong>.
                      </p>
                    </div>
                    {item.isDiscretionary && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                        💬 Consider reviewing whether all {item.category.toLowerCase()} spending brings you real joy — small tweaks can add up.
                      </p>
                    )}
                  </div>
                  <div className="text-right min-w-max">
                    <p className="text-xs text-slate-400">Yearly impact</p>
                    <p className="text-lg font-bold text-emerald-600">{formatINR(yearlyRetained)}</p>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Total potential */}
          <div className="bg-gradient-to-br from-saffron-500 to-orange-500 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-100">Total potential monthly saving</p>
                <p className="text-3xl font-black mt-0.5">{formatINR(analysis.potentialMonthlySaving)}</p>
                <p className="text-orange-100 text-sm mt-1">
                  That's <strong>{formatINR(analysis.potentialMonthlySaving * 12)}/year</strong> freed up just by matching your own budget targets
                </p>
              </div>
              <span className="text-5xl opacity-50">🎯</span>
            </div>
          </div>
        </div>
      )}

      {analysis.wellManaged.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-5">
          <h3 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">🌟 Areas you're managing well</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.wellManaged.map((item) => (
              <span key={item.id} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-medium">
                ✓ {item.category}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">Keep it up! Consistent discipline in these areas is what builds long-term wealth.</p>
        </div>
      )}

      {/* Savings Projection Calculator */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-semibold text-slate-800 dark:text-white">What could your savings grow to?</h2>
          <p className="text-sm text-slate-400 mt-0.5">Choose a mode to see illustrative estimates. All figures are projections — not guarantees.</p>
        </div>

        <div className="p-5 space-y-5">
          {/* Mode selector */}
          <div className="flex gap-3 flex-wrap">
            {(Object.keys(modeLabels) as ProjectionMode[]).map((m) => {
              const ml = modeLabels[m]
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    mode === m
                      ? 'border-saffron-500 bg-saffron-50 dark:bg-saffron-950 text-saffron-700 dark:text-saffron-300 ring-1 ring-saffron-500'
                      : `border-slate-200 dark:border-slate-700 ${ml.color} hover:border-slate-300`
                  }`}
                >
                  <span>{ml.icon}</span>
                  {ml.label}
                </button>
              )
            })}
          </div>

          {/* Controls */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Monthly amount to save (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                <input
                  type="number"
                  min="100"
                  step="500"
                  value={analysis.potentialMonthlySaving || ''}
                  readOnly
                  className="w-full pl-8 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-white focus:outline-none text-sm cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Auto-calculated from your over-budget categories above</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                How many years?
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={projYears}
                onChange={(e) => setProjYears(Number(e.target.value))}
                className="w-full mt-2 accent-saffron-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>1 yr</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{projYears} years</span>
                <span>30 yrs</span>
              </div>
            </div>
          </div>

          {/* Projection result */}
          {analysis.potentialMonthlySaving > 0 && (
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Estimated value after {projYears} year{projYears !== 1 ? 's' : ''}</p>
                    <p className="text-4xl font-black mt-1">{formatINR(projection.futureValue)}</p>
                    {projection.rate > 0 && (
                      <p className="text-slate-400 text-sm mt-1">@ {projection.rate}% p.a. illustrative rate</p>
                    )}
                  </div>
                  <span className="text-4xl opacity-60">
                    {mode === 'pure_saving' ? '🏦' : mode === 'fd' ? '📈' : '📊'}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700 flex gap-6 text-sm">
                  <div>
                    <p className="text-slate-400">You contribute</p>
                    <p className="font-bold">{formatINR(projection.totalContribution)}</p>
                  </div>
                  {projection.interest > 0 && (
                    <div>
                      <p className="text-slate-400">Estimated returns</p>
                      <p className="font-bold text-emerald-400">+{formatINR(projection.interest)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Monthly saving</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">{formatINR(analysis.potentialMonthlySaving)}</p>
                </div>
                <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Yearly saving</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">{formatINR(analysis.potentialMonthlySaving * 12)}</p>
                </div>
              </div>
            </div>
          )}

          {analysis.potentialMonthlySaving === 0 && (
            <div className="p-6 text-center bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-3xl mb-2">🎉</p>
              <p className="font-semibold text-slate-700 dark:text-slate-300">You're within budget in all categories!</p>
              <p className="text-sm text-slate-400 mt-1">Try adding more categories above or adjusting your budget targets to explore savings opportunities.</p>
            </div>
          )}

          {/* Disclaimer */}
          {analysis.potentialMonthlySaving > 0 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-700 dark:text-amber-400">
              ⚠️ <strong>Estimate only:</strong> {projection.disclaimer} These projections do not constitute financial advice.
              Consult a SEBI-registered financial advisor for personalised investment guidance.
            </div>
          )}
        </div>
      </div>

      {/* Quick tips */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Small habits, big impact</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: '☕', tip: 'Making coffee at home 3 days a week instead of buying can save ₹1,500–₹3,000/month depending on your city.' },
            { icon: '📱', tip: 'Audit your subscriptions yearly. Unused apps and services often add up to ₹500–₹2,000/month.' },
            { icon: '🛒', tip: 'A grocery list before shopping reduces impulse buying by 15–30%, keeping you closer to budget.' },
            { icon: '🚇', tip: 'Using public transport 2–3 days a week where available can reduce fuel and parking costs significantly.' },
            { icon: '🍱', tip: 'Meal-prepping for the week typically saves 30–40% compared to daily eating out or ordering in.' },
            { icon: '💳', tip: 'Paying with cash or a debit card for discretionary spending makes you more conscious of amounts.' },
          ].map((t) => (
            <div key={t.icon} className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span className="text-xl">{t.icon}</span>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t.tip}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4">
          These are general suggestions — what works best is always personal to your lifestyle and priorities.
        </p>
      </div>
    </div>
  )
}
