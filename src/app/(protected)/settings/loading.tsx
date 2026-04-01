export default function SettingsLoading() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <div className="h-7 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        <div className="h-4 w-64 bg-slate-100 dark:bg-slate-800 rounded mt-2 animate-pulse" />
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-52 flex-shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-11 border-b border-slate-100 dark:border-slate-800 animate-pulse bg-slate-50 dark:bg-slate-800" />
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
