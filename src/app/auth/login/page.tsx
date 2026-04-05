'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

// Inner component isolates useSearchParams so the outer page can be Suspense-wrapped
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginForm) => {
    setServerError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      setServerError(error.message)
      return
    }
    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8">
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
        Welcome back
      </h2>

      {serverError && (
        <div role="alert" className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register('email')}
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-saffron-600 hover:text-saffron-700"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...register('password')}
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="text-saffron-600 hover:text-saffron-700 font-medium">
          Create one free
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-saffron-500 mb-4">
            <span className="text-2xl">₹</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Money Manager India</h1>
          <p className="text-slate-400 mt-1">Your personal finance companion</p>
        </div>

        {/* Suspense wraps the part that reads searchParams */}
        <Suspense
          fallback={
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
