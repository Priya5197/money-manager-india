'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatINR, formatDate } from '@/utils/format'
import { TransactionForm } from '@/components/transactions/transaction-form'

interface Transaction {
  id: string
  date: string
  type: 'income' | 'expense' | 'transfer'
  amount: number
  notes: string | null
  merchant: string | null
  payment_mode: string | null
  tags: string[] | null
  category_id: string | null
  account_id: string | null
  category_name: string | null
  category_icon: string | null
  account_name: string | null
}

interface Category { id: string; name: string; icon: string; type: string }
interface Account { id: string; name: string }

const PAYMENT_MODES = ['all', 'cash', 'upi', 'card', 'netbanking', 'cheque', 'wallet', 'other']

export default function TransactionsPage() {
  const supabase = createClient()
  const searchParams = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [txs, setTxs] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])

  // Filters
  const [filterType, setFilterType] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterAccount, setFilterAccount] = useState<string>('all')
  const [filterPayment, setFilterPayment] = useState<string>('all')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')
  const [search, setSearch] = useState('')

  // Modal
  const [showForm, setShowForm] = useState(false)
  const [editTx, setEditTx] = useState<Transaction | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Pagination
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [{ data: catData }, { data: accData }] = await Promise.all([
      supabase.from('categories').select('id, name, icon, type').or(`user_id.eq.${user.id},user_id.is.null`).eq('is_archived', false),
      supabase.from('accounts').select('id, name').eq('user_id', user.id).eq('is_archived', false),
    ])
    setCategories(catData ?? [])
    setAccounts(accData ?? [])

    let query = supabase
      .from('transactions')
      .select('id, date, type, amount, notes, merchant, payment_mode, tags, category_id, account_id, categories(name, icon), accounts(name)')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    if (filterType !== 'all') query = query.eq('type', filterType)
    if (filterCategory !== 'all') query = query.eq('category_id', filterCategory)
    if (filterAccount !== 'all') query = query.eq('account_id', filterAccount)
    if (filterPayment !== 'all') query = query.eq('payment_mode', filterPayment)
    if (filterDateFrom) query = query.gte('date', filterDateFrom)
    if (filterDateTo) query = query.lte('date', filterDateTo)
    if (search) query = query.or(`notes.ilike.%${search}%,merchant.ilike.%${search}%`)

    const { data } = await query

    const mapped: Transaction[] = (data ?? []).map((t: Record<string, unknown>) => {
      const cat = t.categories as { name: string; icon: string } | null
      const acc = t.accounts as { name: string } | null
      return {
        id: t.id as string,
        date: t.date as string,
        type: t.type as 'income' | 'expense' | 'transfer',
        amount: Number(t.amount),
        notes: t.notes as string | null,
        merchant: t.merchant as string | null,
        payment_mode: t.payment_mode as string | null,
        tags: t.tags as string[] | null,
        category_id: t.category_id as string | null,
        account_id: t.account_id as string | null,
        category_name: cat?.name ?? null,
        category_icon: cat?.icon ?? null,
        account_name: acc?.name ?? null,
      }
    })
    setTxs(mapped)
    setLoading(false)
  }, [supabase, filterType, filterCategory, filterAccount, filterPayment, filterDateFrom, filterDateTo, search])

  useEffect(() => { loadData() }, [loadData])

  // Open add form based on URL param
  useEffect(() => {
    const addType = searchParams.get('add')
    if (addType === 'income' || addType === 'expense' || addType === 'transfer') {
      setEditTx(null)
      setShowForm(true)
    }
  }, [searchParams])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    await supabase.from('transactions').delete().eq('id', deleteId)
    setDeleteId(null)
    setDeleting(false)
    loadData()
  }

  const exportCSV = () => {
    const headers = ['Date', 'Type', 'Amount', 'Category', 'Account', 'Payment Mode', 'Merchant', 'Notes']
    const rows = txs.map((t) => [
      t.date, t.type, t.amount, t.category_name ?? '', t.account_name ?? '',
      t.payment_mode ?? '', t.merchant ?? '', t.notes ?? '',
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  const paginated = txs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.ceil(txs.length / PAGE_SIZE)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{txs.length} records found</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            ⬇ Export CSV
          </button>
          <button
            onClick={() => { setEditTx(null); setShowForm(true) }}
            className="px-4 py-2 text-sm bg-saffron-500 hover:bg-saffron-600 text-white font-semibold rounded-lg transition-colors"
          >
            + Add Transaction
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Search notes, merchant…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="col-span-2 lg:col-span-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
          />
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setPage(1) }}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
          >
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="transfer">Transfer</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setPage(1) }}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
          <select
            value={filterPayment}
            onChange={(e) => { setFilterPayment(e.target.value); setPage(1) }}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
          >
            {PAYMENT_MODES.map((m) => (
              <option key={m} value={m}>{m === 'all' ? 'All payment modes' : m.toUpperCase()}</option>
            ))}
          </select>
          <input
            type="date"
            value={filterDateFrom}
            onChange={(e) => { setFilterDateFrom(e.target.value); setPage(1) }}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
          />
          <input
            type="date"
            value={filterDateTo}
            onChange={(e) => { setFilterDateTo(e.target.value); setPage(1) }}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
          />
          <button
            onClick={() => { setFilterType('all'); setFilterCategory('all'); setFilterAccount('all'); setFilterPayment('all'); setFilterDateFrom(''); setFilterDateTo(''); setSearch('') }}
            className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading…</div>
        ) : paginated.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-3xl mb-3">💳</p>
            <p className="font-medium text-slate-700 dark:text-slate-300">No transactions found</p>
            <p className="text-sm text-slate-400 mt-1">Add your first transaction to get started</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    {['Date', 'Category', 'Description', 'Account', 'Mode', 'Amount', ''].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {paginated.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span>{tx.category_icon ?? '📦'}</span>
                          {tx.category_name ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 max-w-48 truncate">
                        {tx.merchant || tx.notes || '—'}
                        {tx.tags?.length ? (
                          <div className="flex gap-1 mt-0.5">
                            {tx.tags.map((tag) => (
                              <span key={tag} className="text-xs px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{tx.account_name ?? '—'}</td>
                      <td className="px-4 py-3">
                        {tx.payment_mode && (
                          <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full uppercase">
                            {tx.payment_mode}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-600' : tx.type === 'expense' ? 'text-rose-600' : 'text-slate-600'}`}>
                          {tx.type === 'income' ? '+' : tx.type === 'expense' ? '−' : '⇄'}{formatINR(tx.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditTx(tx); setShowForm(true) }}
                            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteId(tx.id)}
                            className="text-xs text-rose-400 hover:text-rose-600 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, txs.length)} of {txs.length}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Delete transaction?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-semibold rounded-lg"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction form modal */}
      {showForm && (
        <TransactionForm
          categories={categories}
          accounts={accounts}
          editData={editTx}
          onClose={() => { setShowForm(false); setEditTx(null) }}
          onSaved={() => { setShowForm(false); setEditTx(null); loadData() }}
        />
      )}
    </div>
  )
}
