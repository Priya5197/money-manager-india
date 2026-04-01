import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — Money Manager India',
}

const LAST_UPDATED = '1 April 2026'

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-700 dark:text-slate-300">

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">1. Introduction</h2>
            <p>
              Money Manager India (&ldquo;the App&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting your personal information.
              This Privacy Policy explains what data we collect, how we use it, and your rights over your data when you use our services.
            </p>
            <p className="mt-3">
              By creating an account, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">2. Data We Collect</h2>
            <div className="space-y-3">
              <div>
                <p className="font-medium">Account information:</p>
                <p>Your email address, full name, and optional city and state. These are required to provide the service.</p>
              </div>
              <div>
                <p className="font-medium">Financial data you enter:</p>
                <p>
                  Transactions, budgets, salary history, and other financial records that you manually enter or import.
                  This data belongs to you and is stored securely in our database. We do not access your bank accounts.
                </p>
              </div>
              <div>
                <p className="font-medium">Consent records:</p>
                <p>
                  We record the time and nature of your consent to our Terms of Service, Privacy Policy, and marketing communications.
                  This is done for compliance purposes.
                </p>
              </div>
              <div>
                <p className="font-medium">Usage and technical data:</p>
                <p>
                  Basic server logs (IP address, browser type, pages visited) for security and debugging.
                  We do not use cross-site tracking cookies.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">3. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide, operate, and maintain the App.</li>
              <li>To authenticate you and keep your session secure.</li>
              <li>To generate financial reports, insights, and calculations on your behalf.</li>
              <li>To send transactional emails (e.g., account verification, password reset).</li>
              <li>
                <strong>Marketing emails:</strong> Only if you have explicitly opted in. You can withdraw consent at any time from Settings → Privacy &amp; Data.
              </li>
              <li>To comply with applicable law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">4. Marketing Consent</h2>
            <p>
              We will send marketing or promotional emails only if you explicitly check the marketing consent box during registration,
              or enable it later in Settings. If you decline or do not opt in, we will not use your email for marketing.
              You may change this preference at any time in your account Settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">5. Data Sharing and Third Parties</h2>
            <p>
              We do not sell your personal data. We do not share your financial data with advertisers or data brokers.
            </p>
            <p className="mt-3">
              We use the following third-party infrastructure services, which are bound by their own privacy agreements:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Supabase</strong> — database and authentication hosting (supabase.com)</li>
              <li><strong>Vercel</strong> — application hosting (vercel.com)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">6. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. When you delete your account, your profile,
              transactions, budgets, and all associated data are permanently deleted within 30 days.
              Consent logs may be retained for up to 3 years for compliance purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">7. Account Deletion</h2>
            <p>
              You may permanently delete your account at any time from Settings → Privacy &amp; Data → Delete Account.
              This will remove all your personal data from our live systems. After deletion you will be signed out
              immediately and your data cannot be recovered.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">8. Security</h2>
            <p>
              All data is transmitted over encrypted HTTPS connections. Your financial data is stored in a PostgreSQL
              database with row-level security so that only your account can access your records.
              Passwords are never stored in plain text — authentication is managed by Supabase Auth.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">9. Cookies</h2>
            <p>
              We use only essential session cookies to maintain your login state. We do not use advertising cookies
              or third-party tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">10. Your Rights</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Access:</strong> You can view your data at any time within the App.</li>
              <li><strong>Export:</strong> You can download your data from Settings → Privacy &amp; Data → Download My Data.</li>
              <li><strong>Correction:</strong> You can update your profile information in Settings → Profile.</li>
              <li><strong>Deletion:</strong> You can permanently delete your account and all data from Settings.</li>
              <li><strong>Withdraw consent:</strong> You can withdraw marketing consent at any time from Settings.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you by email (if you have an account)
              or by posting a notice in the App at least 14 days before significant changes take effect.
              Continued use of the App after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">12. Contact</h2>
            <p>
              For privacy-related questions, please contact us at:{' '}
              <a href="mailto:privacy@moneymanagerindia.app" className="text-saffron-600 hover:underline">
                privacy@moneymanagerindia.app
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
