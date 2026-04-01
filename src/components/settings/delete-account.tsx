'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function DeleteAccount() {
  const router = useRouter()
  const [understood, setUnderstood] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

  const canDelete = understood && confirmText === 'DELETE'

  const handleDelete = async () => {
    if (!canDelete) return
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError('Not authenticated.'); return }

      // Call soft delete RPC
      const { error: rpcError } = await supabase.rpc('soft_delete_user', { user_uuid: user.id })
      if (rpcError) throw rpcError

      // Sign out
      await supabase.auth.signOut()
      router.push('/?deleted=true')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to delete account. Please contact support.'
      setError(msg)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 rounded-xl">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-rose-800 dark:text-rose-300">Permanently delete your account</h3>
            <p className="text-sm text-rose-700 dark:text-rose-400 mt-1">
              This will permanently delete your account and all associated data including all transactions,
              budgets, categories, salary history, and settings. This action cannot be undone.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg transition-colors text-sm"
      >
        Delete my account
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              Are you absolutely sure?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-5">
              This will permanently delete your Money Manager India account and all your data.
              There is no way to recover it.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={understood}
                  onChange={(e) => setUnderstood(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-600"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  I understand this action is permanent and cannot be undone
                </span>
              </label>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Type <span className="font-mono font-bold text-rose-600">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowModal(false); setConfirmText(''); setUnderstood(false) }}
                className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={!canDelete || loading}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {loading ? 'Deleting…' : 'Delete account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
