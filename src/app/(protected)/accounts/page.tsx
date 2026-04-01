'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatINR } from '@/utils/format'

type AccountType = 'cash' | 'bank' | 'credit_card' | 'wallet' | 'investment' | 'loan'

interface Account {
  id: string
  name: string
  type: AccountType
  balance: number
  icon: string
  color: string
  is_archived: boolean
}

const ACCOUNT_TYPES: { type: AccountType; icon: string; label: string; colorClass: string }[] = [
  { type: 'cash', icon: '💵', label: 'Cash', colorClass: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800' },
  { type: 'bank', icon: '🏦', label: 'Bank Account', colorClass: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800' },
  { type: 'credit_card', icon: '💳', label: 'Credit Card', colorClass: 'bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800' },
  { type: 'wallet', icon: '📱', label: 'Wallet / UPI', colorClass: 'bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800' },
  { type: 'investment', icon: '📈', label: 'Investment', colorClass: 'bg-teal-50 border-teal-200 dark:bg-teal-950 dark:border-teal-800' },
  { type: 'loan', icon: '🏠', label: 'Loan Account', colorClass: 'bg-rose-50 border-rose-200 dark:bg-rose-950 dark:border-rose-800' },
]

export default function AccountsPage() {
  const supabase = createClient()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editAccount, setEditAccount] = useState<Account | null>(null)
  const [formName, setFormName] = useState('')
  const [formType, setFormType] = useState<AccountType>('bank')
  const [formBalance, setFormBalance] = useState('0')
  const [formLoading, setFormLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('accounts').select('*').eq('user_id', user.id).eq('is_archived', false).order('name')
    setAccounts(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const openAdd = () => {
    setEditAccount(null); setFormName(''); setFormType('bank'); setFormBalance('0'); setShowForm(true)
  }
  const openEdit = (acc: Account) => {
    setEditAccount(acc); setFormName(acc.name); setFormType(acc.type); setFormBalance(acc.balance.toString()); setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return
    setFormLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const type = ACCOUNT_TYPES.find((t) => t.type === formType)
    const payload = {
      user_id: user.id,
      name: formName.trim(),
      type: formType,
      balance: parseFloat(formBalance) || 0,
      icon: type?.icon ?? '🏦',
      color: '#1E3A5F',
      is_archived: false,
    }
    if (editAccount) {
      await supabase.from('accounts').update(payload).eq('id', editAccount.id)
    } else {
      await supabase.from('accounts').insert(payload)
    }
    setShowForm(false)
    setFormLoading(false)
    load()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await supabase.from('accounts').update({ is_archived: true }).eq('id', deleteId)
    setDeleteId(null)
    load()
  }

  const totalBalance = accounts.filter((a) => a.type !== 'loan').reduce((s, a) => s + a.balance, 0)
  const totalLiabilities = accounts.filter((a) => a.type === 'loan').reduce((s, a) => s + a.balance, 0)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Accounts</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage your financial accounts</p>
        </div>
        <button onClick={openAdd}
          className="px-4 py-2 text-sm bg-saffron-500 hover:bg-saffron-600 text-white font-semibold rounded-lg transition-colors">
          + Add Account
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <p className="text-sm text-slate-500">Total Assets</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{formatINR(totalBalance)}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <p className="text-sm text-slate-500">Total Liabilities</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{formatINR(totalLiabilities)}</p>
        </div>
      </div>

      {/* Account cards */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />)}
        </div>
      ) : accounts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-16 text-center">
          <p className="text-4xl mb-3">🏦</p>
          <p className="font-medium text-slate-700 dark:text-slate-300">No accounts yet</p>
          <p className="text-sm text-slate-400 mt-1 mb-4">Add your bank accounts, cash, and wallets to get started</p>
          <button onClick={openAdd} className="px-6 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white font-medium rounded-lg transition-colors">
            Add your first account
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc) => {
            const meta = ACCOUNT_TYPES.find((t) => t.type === acc.type)
            return (
              <div key={acc.id} className={`rounded-2xl border p-5 ${meta?.colorClass ?? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{acc.icon}</span>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white text-sm">{acc.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{meta?.label ?? acc.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(acc)} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Edit</button>
                    <button onClick={() => setDeleteId(acc.id)} className="text-xs text-rose-400 hover:text-rose-600 transition-colors">Archive</button>
                  </div>
                </div>
                <p className={`text-xl font-black ${acc.type === 'loan' ? 'text-rose-600' : 'text-slate-800 dark:text-white'}`}>
                  {acc.type === 'loan' ? '−' : ''}{formatINR(acc.balance)}
                </p>
                {acc.type === 'loan' && <p className="text-xs text-slate-400 mt-0.5">Outstanding balance</p>}
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-5">
              {editAccount ? 'Edit Account' : 'Add Account'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Account name</label>
                <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. HDFC Savings, SBI Salary"
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Account type</label>
                <div className="grid grid-cols-2 gap-2">
                  {ACCOUNT_TYPES.map((t) => (
                    <button key={t.type} type="button" onClick={() => setFormType(t.type)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${formType === t.type ? 'bg-saffron-500 border-saffron-500 text-white' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {formType === 'loan' ? 'Outstanding balance (₹)' : 'Current balance (₹)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                  <input type="number" step="0.01" value={formBalance} onChange={(e) => setFormBalance(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500 font-semibold" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl">Cancel</button>
                <button type="submit" disabled={formLoading}
                  className="flex-1 py-2.5 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors">
                  {formLoading ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Archive account?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">The account will be hidden but its transactions will be preserved.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg">Archive</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
