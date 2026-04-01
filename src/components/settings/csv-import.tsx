'use client'

import { useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type ImportType = 'transactions' | 'salary'

interface ParsedRow {
  [key: string]: string
}

interface ValidationResult {
  valid: ParsedRow[]
  errors: { row: number; message: string }[]
}

function parseCSVText(text: string): ParsedRow[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''))
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim().replace(/"/g, ''))
    const row: ParsedRow = {}
    headers.forEach((h, i) => { row[h] = values[i] ?? '' })
    return row
  })
}

function validateTransactionRows(rows: ParsedRow[], mapping: Record<string, string>): ValidationResult {
  const valid: ParsedRow[] = []
  const errors: { row: number; message: string }[] = []

  rows.forEach((row, i) => {
    const rowNum = i + 2 // +2 because row 1 is header
    const mapped: ParsedRow = {}
    Object.entries(mapping).forEach(([field, col]) => {
      mapped[field] = row[col] ?? ''
    })

    const amount = parseFloat(mapped.amount)
    if (!mapped.date) { errors.push({ row: rowNum, message: 'Missing date' }); return }
    if (isNaN(amount) || amount <= 0) { errors.push({ row: rowNum, message: 'Invalid amount' }); return }
    if (!mapped.type || !['income', 'expense', 'transfer'].includes(mapped.type.toLowerCase())) {
      errors.push({ row: rowNum, message: 'Type must be income, expense, or transfer' }); return
    }
    valid.push(mapped)
  })

  return { valid, errors }
}

function validateSalaryRows(rows: ParsedRow[], mapping: Record<string, string>): ValidationResult {
  const valid: ParsedRow[] = []
  const errors: { row: number; message: string }[] = []

  rows.forEach((row, i) => {
    const rowNum = i + 2
    const mapped: ParsedRow = {}
    Object.entries(mapping).forEach(([field, col]) => {
      mapped[field] = row[col] ?? ''
    })

    const year = parseInt(mapped.year)
    const gross = parseFloat(mapped.gross_salary)
    if (isNaN(year) || year < 2000 || year > 2100) { errors.push({ row: rowNum, message: 'Invalid year' }); return }
    if (isNaN(gross) || gross <= 0) { errors.push({ row: rowNum, message: 'Invalid gross salary' }); return }
    valid.push(mapped)
  })

  return { valid, errors }
}

const TRANSACTION_FIELDS = ['date', 'type', 'amount', 'notes', 'payment_mode', 'merchant']
const SALARY_FIELDS = ['year', 'month', 'gross_salary', 'net_salary', 'employer', 'notes']

export function CSVImport() {
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const [importType, setImportType] = useState<ImportType>('transactions')
  const [rawRows, setRawRows] = useState<ParsedRow[]>([])
  const [csvColumns, setCsvColumns] = useState<string[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ inserted: number; skipped: number } | null>(null)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  const fields = importType === 'transactions' ? TRANSACTION_FIELDS : SALARY_FIELDS
  const requiredFields = importType === 'transactions' ? ['date', 'type', 'amount'] : ['year', 'gross_salary']

  const handleFile = (file: File) => {
    setError('')
    setRawRows([])
    setValidation(null)
    setImportResult(null)
    setMapping({})

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const rows = parseCSVText(text)
      if (!rows.length) { setError('No data found in CSV.'); return }
      const cols = Object.keys(rows[0])
      setCsvColumns(cols)
      setRawRows(rows)

      // Auto-map fields where column name matches
      const autoMap: Record<string, string> = {}
      fields.forEach((field) => {
        const match = cols.find((c) => c.toLowerCase() === field.toLowerCase())
        if (match) autoMap[field] = match
      })
      setMapping(autoMap)
    }
    reader.readAsText(file)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.type === 'text/csv' || file?.name.endsWith('.csv')) handleFile(file)
    else setError('Please upload a CSV file.')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importType])

  const validate = () => {
    if (!rawRows.length) return
    const result = importType === 'transactions'
      ? validateTransactionRows(rawRows, mapping)
      : validateSalaryRows(rawRows, mapping)
    setValidation(result)
  }

  const doImport = async () => {
    if (!validation?.valid.length) return
    setImporting(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let inserted = 0
      const batchSize = 50

      if (importType === 'transactions') {
        for (let i = 0; i < validation.valid.length; i += batchSize) {
          const batch = validation.valid.slice(i, i + batchSize).map((row) => ({
            user_id: user.id,
            type: (row.type ?? 'expense').toLowerCase(),
            amount: parseFloat(row.amount),
            date: row.date,
            notes: row.notes || null,
            payment_mode: row.payment_mode || 'other',
            merchant: row.merchant || null,
          }))
          const { count } = await supabase.from('transactions').insert(batch, { count: 'exact' })
          inserted += count ?? 0
        }
      } else {
        for (let i = 0; i < validation.valid.length; i += batchSize) {
          const batch = validation.valid.slice(i, i + batchSize).map((row) => ({
            user_id: user.id,
            year: parseInt(row.year),
            month: row.month ? parseInt(row.month) : null,
            gross_salary: parseFloat(row.gross_salary),
            net_salary: row.net_salary ? parseFloat(row.net_salary) : null,
            employer: row.employer || null,
            notes: row.notes || null,
          }))
          const { count } = await supabase.from('salary_history').insert(batch, { count: 'exact' })
          inserted += count ?? 0
        }
      }

      setImportResult({ inserted, skipped: validation.errors.length })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  const reset = () => {
    setRawRows([])
    setCsvColumns([])
    setMapping({})
    setValidation(null)
    setImportResult(null)
    setError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="space-y-5">
      {/* Type selector */}
      <div className="flex gap-2">
        {(['transactions', 'salary'] as ImportType[]).map((t) => (
          <button
            key={t}
            onClick={() => { setImportType(t); reset() }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              importType === t
                ? 'bg-saffron-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {t === 'transactions' ? '💳 Transactions' : '💰 Salary History'}
          </button>
        ))}
      </div>

      {/* Drop zone */}
      {!rawRows.length && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            dragging
              ? 'border-saffron-400 bg-saffron-50 dark:bg-saffron-950'
              : 'border-slate-300 dark:border-slate-600 hover:border-saffron-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <div className="text-4xl mb-2">📂</div>
          <p className="font-medium text-slate-700 dark:text-slate-300">Drop your CSV file here</p>
          <p className="text-sm text-slate-400 mt-1">or click to browse</p>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
          {error}
        </div>
      )}

      {/* Preview + mapping */}
      {rawRows.length > 0 && !importResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              📋 Found <strong>{rawRows.length}</strong> rows — map columns below
            </p>
            <button onClick={reset} className="text-xs text-slate-400 hover:text-slate-600">
              ✕ Start over
            </button>
          </div>

          {/* Column mapping */}
          <div className="grid gap-3">
            {fields.map((field) => (
              <div key={field} className="flex items-center gap-3">
                <div className="w-36 flex-shrink-0">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                    {field.replace(/_/g, ' ')}
                    {requiredFields.includes(field) && <span className="text-rose-500 ml-1">*</span>}
                  </span>
                </div>
                <select
                  value={mapping[field] ?? ''}
                  onChange={(e) => setMapping((m) => ({ ...m, [field]: e.target.value }))}
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                >
                  <option value="">— skip —</option>
                  {csvColumns.map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Preview table */}
          <div className="overflow-x-auto">
            <p className="text-xs text-slate-400 mb-2">Preview (first 5 rows from CSV):</p>
            <table className="w-full text-xs border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  {csvColumns.map((col) => (
                    <th key={col} className="px-3 py-2 text-left text-slate-600 dark:text-slate-400 font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rawRows.slice(0, 5).map((row, i) => (
                  <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
                    {csvColumns.map((col) => (
                      <td key={col} className="px-3 py-2 text-slate-700 dark:text-slate-300 truncate max-w-32">
                        {row[col] ?? ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!validation && (
            <button
              onClick={validate}
              className="w-full py-2.5 bg-navy-800 hover:bg-navy-900 text-white font-medium rounded-lg transition-colors"
            >
              Validate data
            </button>
          )}

          {/* Validation results */}
          {validation && (
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-1 p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg text-center">
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{validation.valid.length}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">Ready to import</p>
                </div>
                <div className="flex-1 p-3 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 rounded-lg text-center">
                  <p className="text-2xl font-bold text-rose-700 dark:text-rose-400">{validation.errors.length}</p>
                  <p className="text-xs text-rose-600 dark:text-rose-400">Rows with errors</p>
                </div>
              </div>

              {validation.errors.length > 0 && (
                <div className="max-h-32 overflow-y-auto p-3 bg-rose-50 dark:bg-rose-950 rounded-lg">
                  {validation.errors.slice(0, 10).map((e, i) => (
                    <p key={i} className="text-xs text-rose-600 dark:text-rose-400">
                      Row {e.row}: {e.message}
                    </p>
                  ))}
                  {validation.errors.length > 10 && (
                    <p className="text-xs text-rose-500 mt-1">…and {validation.errors.length - 10} more</p>
                  )}
                </div>
              )}

              {validation.valid.length > 0 && (
                <button
                  onClick={doImport}
                  disabled={importing}
                  className="w-full py-2.5 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors"
                >
                  {importing ? `Importing…` : `Import ${validation.valid.length} rows`}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Success */}
      {importResult && (
        <div className="p-5 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center">
          <div className="text-3xl mb-2">✅</div>
          <p className="font-semibold text-emerald-800 dark:text-emerald-300">Import complete!</p>
          <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
            {importResult.inserted} rows imported{importResult.skipped > 0 ? `, ${importResult.skipped} skipped due to errors` : ''}.
          </p>
          <button
            onClick={reset}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors"
          >
            Import more
          </button>
        </div>
      )}
    </div>
  )
}
