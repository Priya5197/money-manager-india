'use client'

import { useState } from 'react'

// ─── Feature H: Bill Reminders — Extendable Architecture Stub ─────────────────
// Future extensions:
//  • Recurring bill detection from transaction history
//  • Push/email notifications (via Supabase Edge Functions + Resend)
//  • Overdue detection and gentle nudges
//  • Integration with UPI autopay tracking
//  • Calendar export (iCal / Google Calendar)
//  • Shared reminders for household bills

interface Reminder {
  id: string
  name: string
  amount: number
  dueDay: number   // Day of month
  category: string
  status: 'paid' | 'pending' | 'overdue'
}

const DEMO_REMINDERS: Reminder[] = [
  { id: '1', name: 'Home Loan EMI', amount: 28500, dueDay: 5, category: 'Loan', status: 'pending' },
  { id: '2', name: 'SBI Credit Card', amount: 12000, dueDay: 15, category: 'Credit Card', status: 'pending' },
  { id: '3', name: 'Electricity Bill', amount: 1800, dueDay: 20, category: 'Utility', status: 'paid' },
  { id: '4', name: 'Internet (Jio Fiber)', amount: 999, dueDay: 1, category: 'Utility', status: 'overdue' },
  { id: '5', name: 'Car Insurance', amount: 8500, dueDay: 28, category: 'Insurance', status: 'pending' },
  { id: '6', name: 'Netflix + Hotstar', amount: 649, dueDay: 12, category: 'Subscription', status: 'paid' },
]

const CATEGORY_COLORS: Record<string, string> = {
  Loan: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300',
  'Credit Card': 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300',
  Utility: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300',
  Insurance: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300',
  Subscription: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
}

const STATUS_STYLES: Record<Reminder['status'], string> = {
  paid: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400',
  pending: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400',
  overdue: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400',
}

function formatINR(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>(DEMO_REMINDERS)
  const today = new Date().getDate()

  const markPaid = (id: string) =>
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'paid' as const } : r)))

  const totalPending = reminders
    .filter((r) => r.status !== 'paid')
    .reduce((s, r) => s + r.amount, 0)

  const overdueCount = reminders.filter((r) => r.status === 'overdue').length
  const pendingCount = reminders.filter((r) => r.status === 'pending').length

  const upcomingInWeek = reminders.filter((r) => {
    const diff = r.dueDay - today
    return r.status === 'pending' && diff >= 0 && diff <= 7
  })

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Bill Reminders</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          Track upcoming bills and never miss a due date
        </p>
      </div>

      {/* Coming soon badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-700 rounded-full text-xs font-semibold text-amber-700 dark:text-amber-400">
        <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
        Preview Mode — Notifications & auto-detection coming soon
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 rounded-2xl p-4 text-center">
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">Overdue</p>
          <p className="text-2xl font-black text-rose-700 dark:text-rose-300 mt-1">{overdueCount}</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-center">
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Pending</p>
          <p className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center">
          <p className="text-xs text-slate-500 font-medium">Amount Due</p>
          <p className="text-xl font-black text-slate-800 dark:text-white mt-1">{formatINR(totalPending)}</p>
        </div>
      </div>

      {/* Upcoming this week */}
      {upcomingInWeek.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
          <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm mb-2">⏰ Due in the next 7 days</p>
          <div className="flex flex-wrap gap-2">
            {upcomingInWeek.map((r) => (
              <span key={r.id} className="px-3 py-1.5 bg-white dark:bg-slate-900 rounded-lg text-sm text-slate-700 dark:text-slate-300 border border-amber-200 dark:border-amber-800">
                {r.name} — {formatINR(r.amount)} (day {r.dueDay})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Reminders list */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-800 dark:text-white">All Bills</h3>
          <button className="px-3 py-1.5 text-sm border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 rounded-lg cursor-not-allowed" disabled>
            + Add Bill (soon)
          </button>
        </div>

        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          {[...reminders].sort((a, b) => a.dueDay - b.dueDay).map((reminder) => (
            <div key={reminder.id} className={`flex items-center gap-4 px-5 py-4 ${reminder.status === 'overdue' ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300 flex-shrink-0">
                {reminder.dueDay}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 dark:text-white text-sm">{reminder.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[reminder.category] ?? 'bg-slate-100 text-slate-600'}`}>
                    {reminder.category}
                  </span>
                  <span className="text-xs text-slate-400">Due on day {reminder.dueDay}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-slate-800 dark:text-white">{formatINR(reminder.amount)}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[reminder.status]}`}>
                  {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                </span>
              </div>
              {reminder.status !== 'paid' && (
                <button
                  onClick={() => markPaid(reminder.id)}
                  className="ml-2 px-3 py-1.5 text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors flex-shrink-0"
                >
                  Mark Paid
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming features */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-3">What&apos;s coming</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: '🔔', text: 'Email & push notifications 3 days before due date' },
            { icon: '🤖', text: 'Auto-detect recurring bills from your transaction history' },
            { icon: '📅', text: 'Export to Google Calendar or iCal' },
            { icon: '💳', text: 'UPI autopay status tracking (NACH mandates)' },
          ].map((f) => (
            <div key={f.text} className="flex gap-2 items-start p-3 bg-slate-50 dark:bg-slate-800 rounded-xl opacity-70">
              <span>{f.icon}</span>
              <p className="text-sm text-slate-600 dark:text-slate-400">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
