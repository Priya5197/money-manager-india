'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Category { id: string; name: string; icon: string; type: string }
interface Account { id: string; name: string }

interface TransactionFormProps {
  categories: Category[]
  accounts: Account[]
  editData?: {
    id: string
    type: string
    amount: number
    date: string
    notes: string | null
    merchant: string | null
    payment_mode: string | null
    tags: string[] | null
    category_id: string | null
    account_id: string | null
  } | null
  onClose: () => void
  onSaved: () => void
}

const PAYMENT_MODES = ['cash', 'upi', 'card', 'netbanking', 'cheque', 'wallet', 'other']

export function TransactionForm({ categories, accounts, editData, onClose, onSaved }: TransactionFormProps) {
  const supabase = createClient()
  const [type, setType] = useState<'income' | 'expense' | 'transfer'>(
    (editData?.type as 'income' | 'expense' | 'transfer') ?? 'expense'
  )
  const [amount, setAmount] = useState(editData?.amount?.toString() ?? '')
  const [date, setDate] = useState(editData?.date ?? new Date().toISOString().slice(0, 10))
  const [categoryId, setCategoryId] = useState(editData?.category_id ?? '')
  const [accountId, setAccountId] = useState(editData?.account_id ?? '')
  const [paymentMode, setPaymentMode] = useState(editData?.payment_mode ?? 'upi')
  const [merchant, setMerchant] = useState(editData?.merchant ?? '')
  const [notes, setNotes] = useState(editData?.notes ?? '')
  const [tags, setTags] = useState(editData?.tags?.join(', ') ?? '')
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringFreq, setRecurringFreq] = useState('monthly')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const filteredCategories = categories.filter((c) =>
    type === 'income' ? c.type === 'income' : c.type === 'expense'
  )

  useEffect(() => {
    // Reset category when type changes
    if (!editData) setCategoryId('')
  }, [type, editData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) { setError('Enter a valid amount greater than 0'); return }
    if (!date) { setError('Date is required'); return }
    if (!accountId && accounts.length > 0) { setError('Please select an account'); return }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not authenticated'); setLoading(false); return }

    const payload = {
      user_id: user.id,
      type,
      amount: amt,
      date,
      category_id: categoryId || null,
      account_id: accountId || null,
      payment_mode: paymentMode,
      merchant: merchant.trim() || null,
      notes: notes.trim() || null,
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : null,
      is_recurring: isRecurring,
      recurring_config: isRecurring ? { frequency: recurringFreq } : null,
    }

    let dbError
    if (editData?.id) {
      const { error } = await supabase.from('transactions').update(payload).eq('id', editData.id)
      dbError = error
    } else {
      const { error } = await supabase.from('transactions').insert(payload)
      dbError = error
    }

    setLoading(false)
    if (dbError) { setError(dbError.message); return }
    onSaved()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              {editData ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-medium transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Type tabs */}
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-5">
            {(['expense', 'income', 'transfer'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                  type === t
                    ? t === 'income'
                      ? 'bg-emerald-500 text-white'
                      : t === 'expense'
                      ? 'bg-rose-500 text-white'
                      : 'bg-blue-500 text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {t === 'income' ? '↑ Income' : t === 'expense' ? '↓ Expense' : '⇄ Transfer'}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500 text-lg font-semibold"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>

            {/* Category */}
            {type !== 'transfer' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                >
                  <option value="">— Select category —</option>
                  {filteredCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Account */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Account</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
              >
                <option value="">— Select account —</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            {/* Payment mode */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment mode</label>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_MODES.map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors uppercase ${
                      paymentMode === mode
                        ? 'bg-saffron-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Merchant + notes */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Merchant / Source
                </label>
                <input
                  type="text"
                  placeholder="e.g. Swiggy, HDFC"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="Optional note"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tags <span className="text-slate-400 font-normal">(comma-separated)</span>
              </label>
              <input
                type="text"
                placeholder="groceries, weekend, essentials"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>

            {/* Recurring */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <input
                type="checkbox"
                id="recurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-saffron-500 focus:ring-saffron-500"
              />
              <label htmlFor="recurring" className="text-sm text-slate-700 dark:text-slate-300">
                This is a recurring transaction
              </label>
              {isRecurring && (
                <select
                  value={recurringFreq}
                  onChange={(e) => setRecurringFreq(e.target.value)}
                  className="ml-auto px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
              >
                {loading ? 'Saving…' : editData ? 'Save changes' : 'Add transaction'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
