'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to error monitoring service in production
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Something went wrong</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-2">
          An unexpected error occurred. We&apos;re sorry for the inconvenience.
        </p>
        {error.digest && (
          <p className="text-xs text-slate-400 mb-6 font-mono">Error ID: {error.digest}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-saffron-500 hover:bg-saffron-600 text-white font-semibold rounded-xl transition-colors"
          >
            Try again
          </button>
          <a
            href="/dashboard"
            className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
