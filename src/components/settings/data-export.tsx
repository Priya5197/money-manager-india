'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type ExportType = 'transactions' | 'budgets' | 'salary' | 'all'

function toCSV(rows: Record<string, unknown>[]): string {
  if (!rows.length) return ''
  const keys = Object.keys(rows[0])
  const header = keys.join(',')
  const body = rows.map((row) =>
    keys.map((k) => {
      const v = row[k]
      const s = v == null ? '' : String(v)
      return s.includes(',') || s.includes('"') || s.includes('\n')
        ? `"${s.replace(/"/g, '""')}"` : s
    }).join(',')
  ).join('\n')
  return `${header}\n${body}`
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function DataExport() {
  const supabase = createClient()
  const [loading, setLoading] = useState<ExportType | null>(null)
  const [error, setError] = useState('')

  const exportTransactions = async () => {
    setLoading('transactions')
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error: dbErr } = await supabase
        .from('transactions')
        .select('date, type, amount, notes, tags, payment_mode, merchant, created_at')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (dbErr) throw dbErr
      if (!data?.length) { setError('No transactions to export.'); return }

      downloadCSV(toCSV(data as Record<string, unknown>[]), `transactions_${new Date().toISOString().slice(0, 10)}.csv`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Export failed')
    } finally {
      setLoading(null)
    }
  }

  const exportBudgets = async () => {
    setLoading('budgets')
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error: dbErr } = await supabase
        .from('budgets')
        .select('month, year, amount, created_at')
        .eq('user_id', user.id)
        .order('year', { ascending: false })

      if (dbErr) throw dbErr
      if (!data?.length) { setError('No budgets to export.'); return }

      downloadCSV(toCSV(data as Record<string, unknown>[]), `budgets_${new Date().toISOString().slice(0, 10)}.csv`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Export failed')
    } finally {
      setLoading(null)
    }
  }

  const exportSalary = async () => {
    setLoading('salary')
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error: dbErr } = await supabase
        .from('salary_history')
        .select('year, month, gross_salary, net_salary, employer, notes, created_at')
        .eq('user_id', user.id)
        .order('year', { ascending: false })

      if (dbErr) throw dbErr
      if (!data?.length) { setError('No salary history to export.'); return }

      downloadCSV(toCSV(data as Record<string, unknown>[]), `salary_history_${new Date().toISOString().slice(0, 10)}.csv`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Export failed')
    } finally {
      setLoading(null)
    }
  }

  const exportAll = async () => {
    setLoading('all')
    setError('')
    try {
      await exportTransactions()
      await exportBudgets()
      await exportSalary()
    } finally {
      setLoading(null)
    }
  }

  const exports = [
    {
      id: 'transactions' as ExportType,
      label: 'Transactions',
      description: 'All income, expense, and transfer records',
      icon: '💳',
      action: exportTransactions,
    },
    {
      id: 'budgets' as ExportType,
      label: 'Budgets',
      description: 'Monthly budget allocations by category',
      icon: '📊',
      action: exportBudgets,
    },
    {
      id: 'salary' as ExportType,
      label: 'Salary History',
      description: 'Salary records for analysis',
      icon: '💰',
      action: exportSalary,
    },
  ]

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-3">
        {exports.map((exp) => (
          <div
            key={exp.id}
            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{exp.icon}</span>
              <div>
                <p className="font-medium text-slate-800 dark:text-white text-sm">{exp.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{exp.description}</p>
              </div>
            </div>
            <button
              onClick={exp.action}
              disabled={loading !== null}
              className="px-4 py-2 text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors"
            >
              {loading === exp.id ? 'Exporting…' : 'Export CSV'}
            </button>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={exportAll}
          disabled={loading !== null}
          className="w-full py-3 px-4 bg-navy-800 hover:bg-navy-900 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
        >
          {loading === 'all' ? 'Exporting all data…' : '⬇ Export All Data (3 files)'}
        </button>
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-2">
          Downloads separate CSV files for each data type
        </p>
      </div>
    </div>
  )
}
