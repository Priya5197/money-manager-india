'use client'

import { useState } from 'react'
import { formatINR, formatPercent } from '@/utils/format'

interface SalaryEntry { year: number; grossSalary: number; netSalary?: number; employer?: string }

interface Prediction { bestCase: number; baseCase: number; conservative: number; assumptions: string }

function calcCAGR(start: number, end: number, years: number): number {
  if (years <= 0 || start <= 0) return 0
  return (Math.pow(end / start, 1 / years) - 1) * 100
}

function linearRegression(data: { x: number; y: number }[]): { slope: number; intercept: number } {
  const n = data.length
  if (n < 2) return { slope: 0, intercept: data[0]?.y ?? 0 }
  const sumX = data.reduce((s, d) => s + d.x, 0)
  const sumY = data.reduce((s, d) => s + d.y, 0)
  const sumXY = data.reduce((s, d) => s + d.x * d.y, 0)
  const sumX2 = data.reduce((s, d) => s + d.x * d.x, 0)
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  return { slope, intercept }
}

function predictSalary(history: SalaryEntry[]): Prediction | null {
  if (history.length < 2) return null
  const sorted = [...history].sort((a, b) => a.year - b.year)
  const data = sorted.map((e, i) => ({ x: i, y: e.grossSalary }))
  const { slope, intercept } = linearRegression(data)
  const nextX = data.length
  const baseCase = intercept + slope * nextX

  const cagr = calcCAGR(sorted[0].grossSalary, sorted[sorted.length - 1].grossSalary, sorted.length - 1)
  const cagrBased = sorted[sorted.length - 1].grossSalary * (1 + cagr / 100)

  return {
    baseCase: Math.max(0, baseCase),
    bestCase: Math.max(0, Math.max(baseCase, cagrBased) * 1.15),
    conservative: Math.max(0, Math.min(baseCase, cagrBased) * 0.90),
    assumptions: `Base case: Linear regression on ${history.length} years of salary data. Best case: 15% above the higher of linear trend and CAGR. Conservative: 10% below the lower estimate. CAGR over period: ${cagr.toFixed(1)}% p.a.`,
  }
}

export default function SalaryAnalyserPage() {
  const [entries, setEntries] = useState<SalaryEntry[]>([
    { year: new Date().getFullYear() - 2, grossSalary: 800000 },
    { year: new Date().getFullYear() - 1, grossSalary: 950000 },
    { year: new Date().getFullYear(), grossSalary: 1100000 },
  ])
  const [showPrediction, setShowPrediction] = useState(false)

  const sorted = [...entries].sort((a, b) => a.year - b.year)
  const prediction = predictSalary(sorted)

  const addRow = () => {
    const lastYear = Math.max(...entries.map((e) => e.year), new Date().getFullYear() - 1)
    setEntries([...entries, { year: lastYear + 1, grossSalary: 0 }])
  }

  const updateEntry = (i: number, field: keyof SalaryEntry, val: string | number) => {
    const updated = [...entries]
    updated[i] = { ...updated[i], [field]: typeof val === 'string' ? val : Number(val) } as SalaryEntry
    setEntries(updated)
  }

  const removeRow = (i: number) => setEntries(entries.filter((_, idx) => idx !== i))

  // YoY growth
  const growthRates = sorted.map((e, i) => {
    if (i === 0) return null
    const prev = sorted[i - 1].grossSalary
    return prev > 0 ? ((e.grossSalary - prev) / prev) * 100 : null
  })

  const cagr = sorted.length >= 2
    ? calcCAGR(sorted[0].grossSalary, sorted[sorted.length - 1].grossSalary, sorted.length - 1)
    : null

  // 5-year projection chart
  const projYears = prediction ? [0, 1, 2, 3, 4, 5].map((offset) => {
    const yr = new Date().getFullYear() + offset
    if (offset === 0) {
      const last = sorted[sorted.length - 1]?.grossSalary ?? 0
      return { yr, base: last, best: last, cons: last, actual: last }
    }
    const last = sorted[sorted.length - 1]?.grossSalary ?? 0
    const base = prediction.baseCase * Math.pow(prediction.baseCase / (sorted[sorted.length - 2]?.grossSalary ?? prediction.baseCase), offset - 1)
    return {
      yr,
      base: last * Math.pow(1 + (prediction.baseCase / last - 1), offset),
      best: last * Math.pow(1 + (prediction.bestCase / last - 1), offset),
      cons: last * Math.pow(1 + (prediction.conservative / last - 1), offset),
      actual: null,
    }
  }) : []

  const maxProj = projYears.length ? Math.max(...projYears.map((p) => p.best), 1) : 1

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Salary Analyser</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          Track salary history, analyse growth, and forecast future earnings
        </p>
      </div>

      <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-400">
        ⚠️ Salary predictions are based on historical trends only and do not account for market conditions,
        promotions, career changes, or economic factors. They are illustrative estimates, not guarantees.
      </div>

      {/* Salary history table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-slate-800 dark:text-white">Salary History</h2>
          <button
            onClick={addRow}
            className="px-3 py-1.5 text-sm bg-saffron-500 hover:bg-saffron-600 text-white font-medium rounded-lg transition-colors"
          >
            + Add Year
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {['Year', 'Gross Salary (₹)', 'Net Salary (₹)', 'Employer', 'YoY Growth', ''].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => {
                const growth = growthRates[sorted.indexOf(entry)]
                return (
                  <tr key={i} className="border-b border-slate-50 dark:border-slate-800">
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={entry.year}
                        onChange={(e) => updateEntry(i, 'year', e.target.value)}
                        className="w-24 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-saffron-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        step="10000"
                        value={entry.grossSalary || ''}
                        onChange={(e) => updateEntry(i, 'grossSalary', e.target.value)}
                        placeholder="e.g. 1200000"
                        className="w-36 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-saffron-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        step="10000"
                        value={entry.netSalary ?? ''}
                        onChange={(e) => updateEntry(i, 'netSalary', e.target.value)}
                        placeholder="Optional"
                        className="w-36 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-saffron-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={entry.employer ?? ''}
                        onChange={(e) => updateEntry(i, 'employer', e.target.value)}
                        placeholder="Company name"
                        className="w-36 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-saffron-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      {growth !== null && growth !== undefined ? (
                        <span className={`text-sm font-medium ${growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                        </span>
                      ) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-3 py-2">
                      <button onClick={() => removeRow(i)} className="text-rose-400 hover:text-rose-600 text-xs transition-colors">
                        Remove
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {cagr !== null && (
          <div className="mt-5 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl flex flex-wrap gap-6">
            <div>
              <p className="text-xs text-slate-500">CAGR (overall period)</p>
              <p className={`text-xl font-bold ${cagr >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{formatPercent(cagr)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Latest Annual Salary</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{formatINR(sorted[sorted.length - 1]?.grossSalary ?? 0)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">First Year Salary</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{formatINR(sorted[0]?.grossSalary ?? 0)}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowPrediction(true)}
          disabled={entries.length < 2}
          className="mt-5 w-full py-3 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-40 text-white font-bold rounded-xl transition-colors"
        >
          {entries.length < 2 ? 'Add at least 2 years to predict' : 'Predict Next-Year Salary'}
        </button>
      </div>

      {/* Prediction results */}
      {showPrediction && prediction && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 text-center">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">Best Case</p>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{formatINR(prediction.bestCase)}</p>
              <p className="text-xs text-emerald-500 mt-1">Optimistic scenario</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 text-center">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Base Case</p>
              <p className="text-2xl font-black text-blue-700 dark:text-blue-300">{formatINR(prediction.baseCase)}</p>
              <p className="text-xs text-blue-500 mt-1">Linear trend projection</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-center">
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">Conservative</p>
              <p className="text-2xl font-black text-slate-700 dark:text-slate-300">{formatINR(prediction.conservative)}</p>
              <p className="text-xs text-slate-500 mt-1">Lower bound estimate</p>
            </div>
          </div>

          {/* 5-year projection chart */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-5">5-Year Salary Projection</h3>
            <div className="space-y-3">
              {projYears.map((pt) => (
                <div key={pt.yr} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-12">{pt.yr}</span>
                  <div className="flex-1 relative h-8">
                    <div className="absolute inset-0 flex flex-col justify-between">
                      <div className="flex items-center gap-1 h-3">
                        <div className="h-2.5 bg-emerald-300 rounded-full opacity-70" style={{ width: `${(pt.best / maxProj) * 100}%` }} />
                      </div>
                      <div className="flex items-center gap-1 h-3">
                        <div className="h-2.5 bg-blue-400 rounded-full" style={{ width: `${(pt.base / maxProj) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="text-right w-40">
                    <p className="text-xs text-emerald-600">{formatINR(pt.best)}</p>
                    <p className="text-xs text-blue-600">{formatINR(pt.base)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assumptions */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              <strong>Methodology & Assumptions:</strong> {prediction.assumptions}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              ⚠️ These predictions are illustrative estimates based solely on past salary data. They do not
              account for promotions, industry changes, economic conditions, or personal career decisions.
              Not financial advice.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
