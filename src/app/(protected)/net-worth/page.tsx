'use client'

import { useState } from 'react'
import { formatINR } from '@/utils/format'

// ─── Feature H: Net Worth — Extendable Architecture Stub ──────────────────────
// Future extensions:
//  • Live account balance sync via Supabase
//  • Asset categories: Cash, Investments, Real Estate, Vehicles, Other
//  • Liability categories: Home Loan, Vehicle Loan, Personal Loan, Credit Card, Other
//  • Historical net worth chart (monthly snapshots)
//  • Goal integration: "achieve ₹1 Cr net worth by 2035"
//  • Automatic valuation for mutual funds (NAV API integration)

interface AssetItem { id: string; label: string; amount: number; category: string }
interface LiabilityItem { id: string; label: string; amount: number; category: string }

const DEMO_ASSETS: AssetItem[] = [
  { id: '1', label: 'Savings Account', amount: 125000, category: 'Cash & Bank' },
  { id: '2', label: 'Mutual Funds (estimated)', amount: 350000, category: 'Investments' },
  { id: '3', label: 'PPF Balance', amount: 220000, category: 'Investments' },
  { id: '4', label: 'Gold (approx. market value)', amount: 80000, category: 'Physical Assets' },
]

const DEMO_LIABILITIES: LiabilityItem[] = [
  { id: '1', label: 'Home Loan Outstanding', amount: 2800000, category: 'Secured Loan' },
  { id: '2', label: 'Personal Loan', amount: 50000, category: 'Unsecured Loan' },
  { id: '3', label: 'Credit Card Balance', amount: 15000, category: 'Credit Card' },
]

export default function NetWorthPage() {
  const [assets, setAssets] = useState<AssetItem[]>(DEMO_ASSETS)
  const [liabilities, setLiabilities] = useState<LiabilityItem[]>(DEMO_LIABILITIES)

  const totalAssets = assets.reduce((s, a) => s + a.amount, 0)
  const totalLiabilities = liabilities.reduce((s, l) => s + l.amount, 0)
  const netWorth = totalAssets - totalLiabilities

  const updateAsset = (id: string, amount: number) =>
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, amount } : a)))

  const updateLiability = (id: string, amount: number) =>
    setLiabilities((prev) => prev.map((l) => (l.id === id ? { ...l, amount } : l)))

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Net Worth</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          Track your total assets, liabilities, and net financial position
        </p>
      </div>

      {/* Coming soon badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-700 rounded-full text-xs font-semibold text-amber-700 dark:text-amber-400">
        <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
        Preview Mode — Full sync coming soon
      </div>

      {/* Net worth summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 text-center">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">Total Assets</p>
          <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{formatINR(totalAssets)}</p>
        </div>
        <div className="bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 rounded-2xl p-5 text-center">
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mb-1">Total Liabilities</p>
          <p className="text-2xl font-black text-rose-700 dark:text-rose-300">{formatINR(totalLiabilities)}</p>
        </div>
        <div className={`rounded-2xl p-5 text-center border ${netWorth >= 0 ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Net Worth</p>
          <p className={`text-2xl font-black ${netWorth >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>
            {netWorth < 0 ? '−' : ''}{formatINR(Math.abs(netWorth))}
          </p>
        </div>
      </div>

      {/* Assets & Liabilities editor */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Assets */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-white">Assets</h3>
            <span className="text-xs text-emerald-600 font-semibold">{formatINR(totalAssets)}</span>
          </div>
          <div className="p-4 space-y-3">
            {assets.map((asset) => (
              <div key={asset.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{asset.label}</p>
                  <p className="text-xs text-slate-400">{asset.category}</p>
                </div>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={asset.amount || ''}
                    onChange={(e) => updateAsset(asset.id, Number(e.target.value))}
                    className="w-32 pl-6 pr-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                </div>
              </div>
            ))}
            <button className="w-full py-2 mt-2 text-sm border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-400 hover:text-saffron-600 hover:border-saffron-400 transition-colors">
              + Add asset (coming soon)
            </button>
          </div>
        </div>

        {/* Liabilities */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-white">Liabilities</h3>
            <span className="text-xs text-rose-600 font-semibold">{formatINR(totalLiabilities)}</span>
          </div>
          <div className="p-4 space-y-3">
            {liabilities.map((liability) => (
              <div key={liability.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{liability.label}</p>
                  <p className="text-xs text-slate-400">{liability.category}</p>
                </div>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={liability.amount || ''}
                    onChange={(e) => updateLiability(liability.id, Number(e.target.value))}
                    className="w-32 pl-6 pr-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                </div>
              </div>
            ))}
            <button className="w-full py-2 mt-2 text-sm border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-400 hover:text-saffron-600 hover:border-saffron-400 transition-colors">
              + Add liability (coming soon)
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming features */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-3">What&apos;s coming</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: '📅', text: 'Monthly net worth snapshots and trend chart' },
            { icon: '🔗', text: 'Automatic sync with linked bank & investment accounts' },
            { icon: '📈', text: 'NAV-based mutual fund valuation via public APIs' },
            { icon: '🏠', text: 'Property valuation estimates based on city/area' },
          ].map((f) => (
            <div key={f.text} className="flex gap-2 items-start p-3 bg-slate-50 dark:bg-slate-800 rounded-xl opacity-70">
              <span>{f.icon}</span>
              <p className="text-sm text-slate-600 dark:text-slate-400">{f.text}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Data entered here is stored locally in your browser session. Full cloud persistence coming with the next release.
      </p>
    </div>
  )
}
