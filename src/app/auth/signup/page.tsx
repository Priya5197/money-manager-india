'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

const signupSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean(),
    marketingConsent: z.boolean().optional(),
  })
  .superRefine((d, ctx) => {
    if (!d.acceptTerms) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'You must accept the terms and privacy policy',
        path: ['acceptTerms'],
      })
    }
    if (d.password !== d.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
    }
  })

type SignupForm = z.infer<typeof signupSchema>

export default function SignupPage() {
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { acceptTerms: false, marketingConsent: false },
  })

  const onSubmit = async (data: SignupForm) => {
    setServerError('')
    const supabase = createClient()
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.fullName, marketing_consent: data.marketingConsent ?? false } },
    })
    if (error) { setServerError(error.message); return }
    if (authData.user) {
      await supabase.from('consent_log').insert([
        { user_id: authData.user.id, consent_type: 'terms_and_privacy', consented: true },
        { user_id: authData.user.id, consent_type: 'marketing', consented: data.marketingConsent ?? false },
      ])
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Check your inbox!</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            We sent a verification link to your email address.
          </p>
          <Link href="/auth/login" className="inline-block px-6 py-3 bg-saffron-500 hover:bg-saffron-600 text-white font-semibold rounded-lg transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-saffron-500 mb-4">
            <span className="text-2xl">₹</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Money Manager India</h1>
          <p className="text-slate-400 mt-1">Free personal finance for India</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
            Create your account
          </h2>
          {serverError && (
            <div role="alert" className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
              {serverError}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="signup-fullname" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full name
              </label>
              <input id="signup-fullname" type="text" autoComplete="name" placeholder="Priya Anandan"
                {...register('fullName')}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition"
              />
              {errors.fullName && <p className="mt-1 text-xs text-rose-600">{errors.fullName.message}</p>}
            </div>
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email address
              </label>
              <input id="signup-email" type="email" autoComplete="email" placeholder="you@example.com"
                {...register('email')}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition"
              />
              {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input id="signup-password" type="password" autoComplete="new-password" placeholder="Min. 8 chars, uppercase & number"
                {...register('password')}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition"
              />
              {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>}
            </div>
            <div>
              <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Confirm password
              </label>
              <input id="signup-confirm-password" type="password" autoComplete="new-password" placeholder="••••••••"
                {...register('confirmPassword')}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition"
              />
              {errors.confirmPassword && <p id="confirm-password-error" className="mt-1 text-xs text-rose-600">{errors.confirmPassword.message}</p>}
            </div>
            <div className="space-y-3 pt-1">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" id="signup-accept-terms" {...register('acceptTerms')}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-saffron-500 focus:ring-saffron-500"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  I accept the{' '}
                  <Link href="/terms" target="_blank" className="text-saffron-600 hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" target="_blank" className="text-saffron-600 hover:underline">Privacy Policy</Link>
                  <span className="text-rose-500"> *</span>
                </span>
              </label>
              {errors.acceptTerms && <p className="text-xs text-rose-600 ml-7">{errors.acceptTerms.message}</p>}
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" {...register('marketingConsent')}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-saffron-500 focus:ring-saffron-500"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  I consent to receive marketing and promotional communications via email{' '}
                  <span className="text-slate-400">(optional)</span>
                </span>
              </label>
            </div>
            <button type="submit" disabled={isSubmitting}
              className="w-full py-3 px-4 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:ring-offset-2 mt-2"
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-saffron-600 hover:text-saffron-700 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
