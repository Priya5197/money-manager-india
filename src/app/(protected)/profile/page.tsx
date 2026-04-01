'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/utils/format'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar Islands', 'Chandigarh', 'Dadra & Nagar Haveli',
  'Daman & Diu', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  city: z.string().optional(),
  state: z.string().optional(),
})

type ProfileForm = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [memberSince, setMemberSince] = useState('')
  const [lastLogin, setLastLogin] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<ProfileForm>({ resolver: zodResolver(profileSchema) })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setEmail(user.email ?? '')
      setMemberSince(user.created_at ?? '')
      setLastLogin(user.last_sign_in_at ?? '')

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, city, state')
        .eq('id', user.id)
        .single()

      if (profile) {
        reset({ full_name: profile.full_name ?? '', city: profile.city ?? '', state: profile.state ?? '' })
      }
      setLoading(false)
    }
    load()
  }, [supabase, reset])

  const onSubmit = async (data: ProfileForm) => {
    setSuccessMsg('')
    setErrorMsg('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: data.full_name, city: data.city, state: data.state, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    if (error) { setErrorMsg('Failed to save profile.'); return }
    setSuccessMsg('Profile saved successfully!')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const initials = email ? email.slice(0, 2).toUpperCase() : 'MM'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your personal information</p>
      </div>

      {/* Avatar + meta */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-saffron-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {initials}
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Member since</p>
            <p className="font-semibold text-slate-800 dark:text-white">
              {memberSince ? formatDate(memberSince) : '—'}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Last login</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {lastLogin ? formatDate(lastLogin) : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-5">Personal Details</h2>

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full name</label>
            <input
              type="text"
              {...register('full_name')}
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500 transition"
            />
            {errors.full_name && <p className="mt-1 text-xs text-rose-600">{errors.full_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email address</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-slate-400">Email cannot be changed here. Contact support.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City</label>
              <input
                type="text"
                placeholder="Mumbai"
                {...register('city')}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">State</label>
              <select
                {...register('state')}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500 transition"
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Currency</label>
            <input
              type="text"
              value="INR — Indian Rupee (₹)"
              readOnly
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors"
            >
              {isSubmitting ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
