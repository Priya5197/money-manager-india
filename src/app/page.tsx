import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-[#F97316] flex items-center justify-center text-white font-bold">
              M
            </div>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-slate-50">
                Money Manager
              </h1>
              <p className="text-xs text-[#F97316] font-semibold">India</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 font-medium transition-colors"
            >
              Login
            </Link>
            <Link href="/auth/signup">
              <Button size="md" variant="primary">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 max-w-6xl mx-auto w-full">
        {/* Background gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#F97316]/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 text-center space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 text-[#F97316] px-4 py-2 rounded-full border border-[#F97316]/20">
            <span className="w-2 h-2 rounded-full bg-[#F97316]" />
            <span className="text-sm font-semibold">Welcome to Smart Finance Management</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
            Take Control of Your{' '}
            <span className="bg-gradient-to-r from-[#F97316] to-orange-600 bg-clip-text text-transparent">
              Finances
            </span>
          </h2>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Money Manager India is your personal finance companion. Track every rupee, plan your budget, and achieve your financial goals with powerful tools built for Indian investors.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/auth/signup" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" fullWidth>
                Get Started Free
              </Button>
            </Link>
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" fullWidth>
                Already have an account? Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              Powerful Features for Smart Financial Management
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Everything you need to take control of your finances
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#F97316] dark:hover:border-[#F97316] transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[#F97316]/10 flex items-center justify-center text-[#F97316] mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Expense Tracking
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                Track every rupee you spend with detailed categorization and smart insights into your spending patterns.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#F97316] dark:hover:border-[#F97316] transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[#F97316]/10 flex items-center justify-center text-[#F97316] mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Budget Planning
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                Set monthly budgets, get real-time alerts when you're approaching limits, and optimize your spending.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#F97316] dark:hover:border-[#F97316] transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[#F97316]/10 flex items-center justify-center text-[#F97316] mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8L5.257 19.393A2 2 0 005 18.734V5a2 2 0 012-2h10a2 2 0 012 2z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Financial Reports
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                Get detailed insights into your financial health with comprehensive reports and visual analytics.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#F97316] dark:hover:border-[#F97316] transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[#F97316]/10 flex items-center justify-center text-[#F97316] mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Tax Calculator
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                Calculate your tax liabilities with Indian tax rules and deductions built into the platform.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#F97316] dark:hover:border-[#F97316] transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[#F97316]/10 flex items-center justify-center text-[#F97316] mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Goal Tracking
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                Set and track financial goals, from emergency funds to home purchases and vacation planning.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#F97316] dark:hover:border-[#F97316] transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[#F97316]/10 flex items-center justify-center text-[#F97316] mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Smart Calculators
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                EMI calculator, investment returns, salary insights - all built in to help you make smarter financial decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#F97316] to-orange-600 dark:from-[#F97316] dark:to-orange-700">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Take Control?
          </h3>
          <p className="text-lg text-white/90 mb-8">
            Join thousands of Indians who are managing their finances smarter with Money Manager India.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              variant="secondary"
              fullWidth={false}
              className="text-[#F97316] hover:text-orange-600"
            >
              Get Started Free Today
            </Button>
          </Link>
          <p className="text-sm text-white/70 mt-4">
            No credit card required. Completely free forever.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center text-white font-bold text-sm">
                  M
                </div>
                <span className="font-bold text-slate-900 dark:text-slate-50">
                  Money Manager India
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Smart personal finance management for Indians.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-[#F97316] transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#F97316] transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">
                Legal
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-[#F97316] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-[#F97316] transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">
                Contact
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                support@moneymanagerindia.com
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Copyright 2024 Money Manager India. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-slate-600 dark:text-slate-400 hover:text-[#F97316] transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-slate-600 dark:text-slate-400 hover:text-[#F97316] transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.186.092-.923.35-1.544.636-1.9-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.193 20 14.431 20 10.017 20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
