import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-saffron-500 leading-none mb-4">404</div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Page not found</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          The page you are looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-saffron-500 hover:bg-saffron-600 text-white font-semibold rounded-xl transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
