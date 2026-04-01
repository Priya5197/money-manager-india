'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DeleteAccount } from '@/components/settings/delete-account'
import { DataExport } from '@/components/settings/data-export'
import { CSVImport } from '@/components/settings/csv-import'
import { CategoryManager } from '@/components/settings/category-manager'
import Link from 'next/link'

type Tab = 'general' | 'categories' | 'privacy' | 'import-export' | 'about'

const APP_VERSION = '1.0.0'

export default function SettingsPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<Tab>('general')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [consentLoading, setConsentLoading] = useState(false)
  const [consentSaved, setConsentSaved] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('marketing_consent')
        .eq('id', user.id)
        .single()
      if (profile) setMarketingConsent(profile.marketing_consent ?? false)

      const { data: prefs } = await supabase
        .from('user_preferences')
        .select('theme, notifications_enabled')
        .eq('user_id', user.id)
        .single()
      if (prefs) {
        setTheme((prefs.theme as 'light' | 'dark') ?? 'light')
        setNotificationsEnabled(prefs.notifications_enabled ?? true)
      }
    }
    load()
  }, [supabase])

  const savePreferences = async (updates: { theme?: string; notifications_enabled?: boolean }) => {
    if (!userId) return
    await supabase.from('user_preferences').upsert({ user_id: userId, ...updates, updated_at: new Date().toISOString() })
  }

  const handleThemeToggle = async (val: boolean) => {
    const newTheme = val ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark', val)
    await savePreferences({ theme: newTheme })
  }

  const handleNotificationsToggle = async (val: boolean) => {
    setNotificationsEnabled(val)
    await savePreferences({ notifications_enabled: val })
  }

  const handleMarketingConsentToggle = async (val: boolean) => {
    if (!userId) return
    setConsentLoading(true)
    setMarketingConsent(val)
    await supabase.from('profiles').update({
      marketing_consent: val,
      marketing_consent_at: new Date().toISOString(),
    }).eq('id', userId)
    await supabase.from('consent_log').insert({
      user_id: userId,
      consent_type: 'marketing',
      consented: val,
    })
    setConsentLoading(false)
    setConsentSaved(true)
    setTimeout(() => setConsentSaved(false), 2000)
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'categories', label: 'Categories', icon: '🏷️' },
    { id: 'privacy', label: 'Privacy & Data', icon: '🔒' },
    { id: 'import-export', label: 'Import / Export', icon: '📁' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
  ]

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your preferences and account</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar nav */}
        <nav className="lg:w-52 flex-shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left ${
                  activeTab === tab.id
                    ? 'bg-saffron-50 dark:bg-saffron-950 text-saffron-700 dark:text-saffron-400 border-r-2 border-saffron-500'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* General */}
          {activeTab === 'general' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">General Settings</h2>

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-300 text-sm">Dark Mode</p>
                    <p className="text-xs text-slate-400 mt-0.5">Switch between light and dark theme</p>
                  </div>
                  <button
                    role="switch"
                    aria-checked={theme === 'dark'}
                    onClick={() => handleThemeToggle(theme !== 'dark')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:ring-offset-2 ${
                      theme === 'dark' ? 'bg-saffron-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5">
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-300 text-sm">Notifications</p>
                    <p className="text-xs text-slate-400 mt-0.5">Budget alerts and spending reminders</p>
                  </div>
                  <button
                    role="switch"
                    aria-checked={notificationsEnabled}
                    onClick={() => handleNotificationsToggle(!notificationsEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:ring-offset-2 ${
                      notificationsEnabled ? 'bg-saffron-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
                  <p className="font-medium text-slate-700 dark:text-slate-300 text-sm mb-1">Currency</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">INR — Indian Rupee (₹)</p>
                  <p className="text-xs text-slate-400 mt-1">Multi-currency support coming soon</p>
                </div>
              </div>
            </div>
          )}

          {/* Categories */}
          {activeTab === 'categories' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5">
                Manage Categories
              </h2>
              <CategoryManager />
            </div>
          )}

          {/* Privacy & Data */}
          {activeTab === 'privacy' && (
            <div className="space-y-5">
              {/* Marketing consent */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
                  Marketing Communications
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                  Control whether you receive promotional emails about new features and offers.
                </p>
                <div className="flex items-start gap-4">
                  <button
                    role="switch"
                    aria-checked={marketingConsent}
                    onClick={() => handleMarketingConsentToggle(!marketingConsent)}
                    disabled={consentLoading}
                    className={`mt-0.5 relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:ring-offset-2 disabled:opacity-60 ${
                      marketingConsent ? 'bg-saffron-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      marketingConsent ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      I consent to receive marketing and promotional communications via email
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      You can change this at any time. We will never share your email with third parties.
                    </p>
                    {consentSaved && (
                      <p className="text-xs text-emerald-600 mt-1">✓ Preference saved</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Download data */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">Download My Data</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                  Export a copy of all your data in CSV format.
                </p>
                <DataExport />
              </div>

              {/* Delete account */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900 p-6">
                <h2 className="text-lg font-semibold text-rose-700 dark:text-rose-400 mb-1">Danger Zone</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                  Permanently delete your account and all data.
                </p>
                <DeleteAccount />
              </div>
            </div>
          )}

          {/* Import/Export */}
          {activeTab === 'import-export' && (
            <div className="space-y-5">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">Import Data</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                  Import transactions or salary history from a CSV file.
                </p>
                <CSVImport />
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">Export Data</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                  Download your data as CSV files.
                </p>
                <DataExport />
              </div>
            </div>
          )}

          {/* About */}
          {activeTab === 'about' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-saffron-500 flex items-center justify-center text-2xl">
                  ₹
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">Money Manager India</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Version {APP_VERSION}</p>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                A free, open-source personal finance app designed for Indian users.
                Track income and expenses, manage budgets, analyse salary trends, and calculate EMIs — all in one place.
              </p>

              <div className="space-y-3">
                {[
                  { label: 'Privacy Policy', href: '/privacy', icon: '🔒' },
                  { label: 'Terms of Service', href: '/terms', icon: '📄' },
                  { label: 'GitHub Repository', href: 'https://github.com/yourusername/money-manager-india', icon: '🐙', external: true },
                  { label: 'Report an Issue', href: 'https://github.com/yourusername/money-manager-india/issues', icon: '🐛', external: true },
                  { label: 'Contact Support', href: 'mailto:support@moneymanagerindia.app', icon: '📧', external: true },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <span>{link.icon}</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{link.label}</span>
                    {link.external && <span className="ml-auto text-slate-400 text-xs">↗</span>}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-400 text-center">
                  Built with ❤️ for India · MIT License · Free forever
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
