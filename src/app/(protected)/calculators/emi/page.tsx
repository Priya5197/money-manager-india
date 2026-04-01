'use client'

import { useState, useEffect } from 'react'
import { formatINR, formatPercent } from '@/utils/format'
import { createClient } from '@/lib/supabase/client'

type LoanType = 'home' | 'personal' | 'vehicle' | 'education' | 'property'

interface AmortRow { month: number; emi: number; principal: number; interest: number; balance: number }
interface LoanRate { bank_name: string; min_rate: number; max_rate: number; processing_fee: string; source_url: string; fetched_at: string }

const CIBIL_BANDS: Record<string, Record<LoanType, string>> = {
  '800-900': { home: '8.40%–9.00%', personal: '10.50%–12.00%', vehicle: '7.25%–8.50%', education: '8.50%–10.00%', property: '8.75%–9.50%' },
  '750-799': { home: '8.75%–9.50%', personal: '12.00%–14.00%', vehicle: '8.00%–9.25%', education: '9.00%–10.50%', property: '9.25%–10.00%' },
  '650-749': { home: '9.50%–10.50%', personal: '14.00%–18.00%', vehicle: '9.00%–11.00%', education: '10.00%–12.00%', property: '10.00%–11.50%' },
  '550-649': { home: '10.50%–12.00%', personal: '18.00%–24.00%', vehicle: '11.00%–13.00%', education: '11.00%–14.00%', property: '11.50%–13.00%' },
  '300-549': { home: 'May not qualify', personal: 'May not qualify', vehicle: 'May not qualify', education: 'May not qualify', property: 'May not qualify' },
}

function calcEMI(p: number, rAnnual: number, months: number): number {
  if (rAnnual === 0) return p / months
  const r = rAnnual / 12 / 100
  return (p * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

function buildSchedule(p: number, rAnnual: number, months: number): AmortRow[] {
  const r = rAnnual / 12 / 100
  const emi = calcEMI(p, rAnnual, months)
  const rows: AmortRow[] = []
  let balance = p
  for (let i = 1; i <= months; i++) {
    const interest = balance * r
    const principal = emi - interest
    balance = Math.max(0, balance - principal)
    rows.push({ month: i, emi, principal, interest, balance })
  }
  return rows
}

export default function EMICalculatorPage() {
  const supabase = createClient()
  const [loanType, setLoanType] = useState<LoanType>('home')
  const [principal, setPrincipal] = useState(3000000)
  const [rate, setRate] = useState(8.5)
  const [tenureYears, setTenureYears] = useState(20)
  const [processingFee, setProcessingFee] = useState(0)
  const [prepayment, setPrepayment] = useState(0)
  const [cibilBand, setCibilBand] = useState('750-799')
  const [schedule, setSchedule] = useState<AmortRow[]>([])
  const [schedulePage, setSchedulePage] = useState(1)
  const [loanRates, setLoanRates] = useState<LoanRate[]>([])
  const [ratesLoading, setRatesLoading] = useState(true)
  const [showSchedule, setShowSchedule] = useState(false)

  const months = tenureYears * 12
  const emi = calcEMI(principal, rate, months)
  const totalPayable = emi * months + processingFee
  const totalInterest = totalPayable - principal - processingFee
  const feeAmount = processingFee

  useEffect(() => {
    setSchedule(buildSchedule(principal, rate, months))
    setSchedulePage(1)
  }, [principal, rate, months])

  useEffect(() => {
    const load = async () => {
      setRatesLoading(true)
      const { data } = await supabase
        .from('loan_rates')
        .select('bank_name, min_rate, max_rate, processing_fee, source_url, fetched_at')
        .eq('loan_type', loanType)
        .order('min_rate')
      setLoanRates(data ?? [])
      setRatesLoading(false)
    }
    load()
  }, [supabase, loanType])

  const LOAN_TYPES: { id: LoanType; label: string; icon: string }[] = [
    { id: 'home', label: 'Home Loan', icon: '🏠' },
    { id: 'personal', label: 'Personal Loan', icon: '👤' },
    { id: 'vehicle', label: 'Vehicle Loan', icon: '🚗' },
    { id: 'education', label: 'Education Loan', icon: '🎓' },
    { id: 'property', label: 'Property Loan', icon: '🏢' },
  ]

  const SCHED_PAGE_SIZE = 12
  const schedPage = schedule.slice((schedulePage - 1) * SCHED_PAGE_SIZE, schedulePage * SCHED_PAGE_SIZE)
  const schedTotalPages = Math.ceil(schedule.length / SCHED_PAGE_SIZE)

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">EMI Calculator</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          Calculate loan EMI, view amortization schedule, and compare lenders
        </p>
      </div>

      {/* Loan type tabs */}
      <div className="flex gap-2 flex-wrap">
        {LOAN_TYPES.map((lt) => (
          <button
            key={lt.id}
            onClick={() => setLoanType(lt.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              loanType === lt.id
                ? 'bg-saffron-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {lt.icon} {lt.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Input form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
          <h2 className="font-semibold text-slate-800 dark:text-white">Loan Details</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Loan Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
              <input
                type="number"
                min="10000"
                step="10000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500 font-semibold"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{formatINR(principal)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Interest Rate (% per annum)
            </label>
            <input
              type="number"
              min="1"
              max="36"
              step="0.05"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Loan Tenure (years)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500 font-semibold"
            />
            <p className="text-xs text-slate-400 mt-1">{months} months</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Processing Fee (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
              <input
                type="number"
                min="0"
                step="100"
                value={processingFee}
                onChange={(e) => setProcessingFee(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-gradient-to-br from-saffron-500 to-orange-500 rounded-2xl p-6 text-white">
            <p className="text-sm font-medium text-orange-100 mb-1">Monthly EMI</p>
            <p className="text-4xl font-black">{formatINR(emi)}</p>
            <p className="text-sm text-orange-100 mt-1">{tenureYears} years at {rate}% p.a.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-xs text-slate-500 mb-1">Principal</p>
              <p className="text-lg font-bold text-slate-800 dark:text-white">{formatINR(principal)}</p>
              <p className="text-xs text-slate-400 mt-1">
                {totalPayable > 0 ? formatPercent((principal / totalPayable) * 100) : '—'} of total
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-xs text-slate-500 mb-1">Total Interest</p>
              <p className="text-lg font-bold text-rose-600">{formatINR(totalInterest)}</p>
              <p className="text-xs text-slate-400 mt-1">
                {totalPayable > 0 ? formatPercent((totalInterest / totalPayable) * 100) : '—'} of total
              </p>
            </div>
            {feeAmount > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-xs text-slate-500 mb-1">Processing Fee</p>
                <p className="text-lg font-bold text-amber-600">{formatINR(feeAmount)}</p>
              </div>
            )}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 col-span-full">
              <p className="text-xs text-slate-500 mb-1">Total Amount Payable</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{formatINR(totalPayable)}</p>
            </div>
          </div>

          {/* Visual breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Principal vs Interest</p>
            <div className="flex h-4 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500"
                style={{ width: `${(principal / (principal + totalInterest)) * 100}%` }}
                title={`Principal: ${formatINR(principal)}`}
              />
              <div
                className="bg-rose-500"
                style={{ width: `${(totalInterest / (principal + totalInterest)) * 100}%` }}
                title={`Interest: ${formatINR(totalInterest)}`}
              />
            </div>
            <div className="flex gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-3 rounded-full bg-emerald-500" />Principal</span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-3 rounded-full bg-rose-500" />Interest</span>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-semibold text-slate-800 dark:text-white">Amortization Schedule</h2>
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {showSchedule ? 'Hide' : 'Show'} schedule
          </button>
        </div>

        {showSchedule && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    {['Month', 'EMI', 'Principal', 'Interest', 'Balance'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {schedPage.map((row) => (
                    <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{row.month}</td>
                      <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-white">{formatINR(row.emi)}</td>
                      <td className="px-4 py-2.5 text-emerald-600">{formatINR(row.principal)}</td>
                      <td className="px-4 py-2.5 text-rose-600">{formatINR(row.interest)}</td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{formatINR(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {schedTotalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-400">Month {(schedulePage - 1) * SCHED_PAGE_SIZE + 1} – {Math.min(schedulePage * SCHED_PAGE_SIZE, months)}</p>
                <div className="flex gap-2">
                  <button onClick={() => setSchedulePage((p) => Math.max(1, p - 1))} disabled={schedulePage === 1}
                    className="px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800">←</button>
                  <button onClick={() => setSchedulePage((p) => Math.min(schedTotalPages, p + 1))} disabled={schedulePage === schedTotalPages}
                    className="px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800">→</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* CIBIL Estimation */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-1">CIBIL Score → Rate Estimate</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Select your CIBIL score range to see the typical rate band you may be offered. This is indicative only.
        </p>
        <div className="flex gap-2 flex-wrap mb-4">
          {Object.keys(CIBIL_BANDS).map((band) => (
            <button
              key={band}
              onClick={() => setCibilBand(band)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                cibilBand === band ? 'bg-navy-800 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {band}
            </button>
          ))}
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            For a <strong>{loanType.charAt(0).toUpperCase() + loanType.slice(1)} Loan</strong> with CIBIL score{' '}
            <strong>{cibilBand}</strong>, indicative rate band:
          </p>
          <p className="text-xl font-bold text-saffron-600 mt-1">{CIBIL_BANDS[cibilBand]?.[loanType]}</p>
        </div>
        <p className="text-xs text-slate-400 mt-3">
          ⚠️ This is indicative only and not an approval or sanctioned offer. Actual rates depend on lender&apos;s assessment,
          income, existing obligations, and other factors. Always verify directly with the lender.
        </p>
      </div>

      {/* Live Rates */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-1">Indicative Bank Rates</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Illustrative rates for comparison. Always verify current terms directly with the lender.
        </p>
        {ratesLoading ? (
          <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />)}</div>
        ) : loanRates.length === 0 ? (
          <p className="text-slate-400 text-sm">No rate data available for this loan type.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  {['Bank', 'Min Rate', 'Max Rate', 'Processing Fee', 'Source'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {loanRates.map((lr, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-white">{lr.bank_name}</td>
                    <td className="px-4 py-2.5 text-emerald-600">{lr.min_rate}%</td>
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{lr.max_rate}%</td>
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{lr.processing_fee}</td>
                    <td className="px-4 py-2.5">
                      <a href={lr.source_url} target="_blank" rel="noopener noreferrer"
                        className="text-saffron-600 hover:underline text-xs">Visit →</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loanRates[0]?.fetched_at && (
              <p className="text-xs text-slate-400 px-4 py-2 border-t border-slate-100 dark:border-slate-800">
                Last verified: {new Date(loanRates[0].fetched_at).toLocaleDateString('en-IN')} · Rates are indicative and subject to change. Verify with bank directly.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
