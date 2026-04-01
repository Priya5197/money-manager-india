import Link from 'next/link'

const calculators = [
  {
    href: '/calculators/emi',
    icon: '🏦',
    title: 'EMI Calculator',
    description: 'Calculate monthly EMI for home, personal, vehicle, education, or property loans. Compare lenders and view full amortization schedules.',
    features: ['Home, Personal, Vehicle loans', 'Amortization schedule', 'Lender comparison', 'CIBIL-based rate estimate'],
    color: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
    badgeColor: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
  },
  {
    href: '/calculators/tax',
    icon: '📋',
    title: 'Tax Calculator',
    description: 'Compare Old vs New tax regime, calculate deductions (80C, 80D, HRA, NPS), and find which regime saves you more tax.',
    features: ['Old vs New regime comparison', 'All major deductions', 'FY 2024-25 & 2023-24', 'Tax slab breakdown'],
    color: 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300',
  },
  {
    href: '/calculators/salary',
    icon: '📈',
    title: 'Salary Analyser',
    description: 'Analyse your salary history, calculate CAGR, and predict future salary using transparent statistical methods.',
    features: ['Multi-year history', 'CAGR analysis', 'Best/base/conservative forecast', 'CSV import'],
    color: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800',
    badgeColor: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
  },
]

export default function CalculatorsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Financial Calculators</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          Tools to help you make informed financial decisions
        </p>
      </div>

      <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl">
        <p className="text-sm text-amber-700 dark:text-amber-400">
          ⚠️ All calculators provide estimates for informational purposes only. They are not financial advice.
          Verify calculations with official sources and consult a qualified financial advisor before making decisions.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {calculators.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className={`block border rounded-2xl p-6 transition-all hover:shadow-md hover:-translate-y-0.5 ${calc.color}`}
          >
            <div className="text-4xl mb-3">{calc.icon}</div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{calc.title}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{calc.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {calc.features.map((f) => (
                <span key={f} className={`text-xs px-2 py-0.5 rounded-full font-medium ${calc.badgeColor}`}>
                  {f}
                </span>
              ))}
            </div>
            <div className="mt-4 text-sm font-semibold text-saffron-600">
              Open calculator →
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
