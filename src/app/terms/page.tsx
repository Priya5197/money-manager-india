import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service — Money Manager India',
}

const LAST_UPDATED = '1 April 2026'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
            <span className="w-8 h-8 bg-saffron-500 rounded-lg flex items-center justify-center text-white text-sm">₹</span>
            Money Manager India
          </Link>
          <Link href="/auth/login" className="text-sm text-saffron-600 hover:text-saffron-700 font-medium">
            Sign in
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="space-y-8 text-slate-700 dark:text-slate-300">

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By creating an account or using Money Manager India, you agree to be bound by these Terms of Service.
              If you do not agree, please do not use the App.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">2. Description of Service</h2>
            <p>
              Money Manager India is a free personal finance management tool that helps you track income and expenses,
              manage budgets, calculate loan EMIs, and analyse financial data. The App is provided &ldquo;as-is&rdquo; and is
              intended for personal, non-commercial use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">3. No Financial Advice</h2>
            <p>
              <strong>Important disclaimer:</strong> Money Manager India provides financial calculators, estimates,
              projections, and insights for informational and educational purposes only. All calculations — including
              EMI estimates, tax calculations, savings projections, and salary predictions — are estimates based on
              inputs you provide and stated assumptions.
            </p>
            <p className="mt-3">
              Nothing in the App constitutes financial advice, investment advice, tax advice, or legal advice.
              Consult a qualified financial advisor, chartered accountant, or legal professional for advice
              specific to your situation. The App&apos;s authors are not responsible for any financial decisions
              made based on information displayed in the App.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">4. Data Accuracy</h2>
            <p>
              Loan rate information shown in the App is fetched periodically from publicly available sources and
              is provided for illustrative comparison only. Rates and fees are subject to change; always verify
              current terms directly with the lender before making any financial decision.
            </p>
            <p className="mt-3">
              Tax information displayed in the App is based on publicly available government notifications.
              Tax rules change each financial year. Always verify with official government sources (incometax.gov.in)
              or a qualified tax professional.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">5. User Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You are responsible for the accuracy of all data you enter into the App.</li>
              <li>You must keep your login credentials confidential.</li>
              <li>You must not use the App for any unlawful purpose.</li>
              <li>You must not attempt to gain unauthorised access to other users&apos; data.</li>
              <li>You must be at least 18 years old to create an account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">6. Data Ownership</h2>
            <p>
              Your financial data belongs to you. We do not claim ownership of any data you enter.
              You may export and delete your data at any time. See our{' '}
              <Link href="/privacy" className="text-saffron-600 hover:underline">Privacy Policy</Link> for full details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">7. Service Availability</h2>
            <p>
              We aim to keep the App available but cannot guarantee uninterrupted access. We may update, modify,
              or temporarily suspend the service at any time. We will provide reasonable notice for significant changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Money Manager India and its authors shall not be liable for
              any indirect, incidental, special, consequential, or punitive damages arising from your use of the App.
              Total liability shall not exceed the amounts paid by you to us in the 12 months preceding the claim
              (which, given that the App is currently free, will be zero).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">9. Governing Law</h2>
            <p>
              These Terms are governed by the laws of India. Any disputes arising shall be subject to the
              exclusive jurisdiction of the courts of India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">10. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. We will provide at least 14 days&apos; notice of material changes.
              Continued use of the App after changes constitutes your acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">11. Contact</h2>
            <p>
              For questions about these Terms, contact us at:{' '}
              <a href="mailto:legal@moneymanagerindia.app" className="text-saffron-600 hover:underline">
                legal@moneymanagerindia.app
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
