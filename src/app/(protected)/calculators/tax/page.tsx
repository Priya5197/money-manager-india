'use client'

import { useState } from 'react'
import { formatINR } from '@/utils/format'

type FY = '2024-25' | '2023-24'
type AgeGroup = 'below_60' | '60_to_80' | 'above_80'

interface TaxParams {
  grossSalary: number
  otherIncome: number
  hra: number
  section80C: number
  section80D: number
  section80CCD1B: number
  homeLoanInterest: number
  lta: number
  otherDeductions: number
}

// Tax slab calculation
function calcOldRegime(p: TaxParams, fy: FY, age: AgeGroup) {
  const stdDeduction = 50000
  const { grossSalary, otherIncome, hra, section80C, section80D, section80CCD1B, homeLoanInterest, lta, otherDeductions } = p

  const gross = grossSalary + otherIncome
  const deductions = stdDeduction + hra + Math.min(section80C, 150000) + Math.min(section80D, 100000) +
    Math.min(section80CCD1B, 50000) + Math.min(homeLoanInterest, 200000) + lta + otherDeductions
  const taxableIncome = Math.max(0, gross - deductions)

  // Slabs for FY 2024-25 old regime
  let tax = 0
  const basic = age === 'above_80' ? 500000 : age === '60_to_80' ? 300000 : 250000

  if (taxableIncome > basic) {
    if (taxableIncome <= 500000) {
      tax = (taxableIncome - basic) * 0.05
    } else if (taxableIncome <= 1000000) {
      tax = (500000 - basic) * 0.05 + (taxableIncome - 500000) * 0.2
    } else {
      tax = (500000 - basic) * 0.05 + 500000 * 0.2 + (taxableIncome - 1000000) * 0.3
    }
  }

  // 87A rebate (taxable income ≤ 5L)
  if (taxableIncome <= 500000) tax = 0

  // Surcharge
  let surcharge = 0
  if (taxableIncome > 50000000) surcharge = tax * 0.37
  else if (taxableIncome > 20000000) surcharge = tax * 0.25
  else if (taxableIncome > 10000000) surcharge = tax * 0.15
  else if (taxableIncome > 5000000) surcharge = tax * 0.10

  const cess = (tax + surcharge) * 0.04

  return { taxableIncome, deductions, tax, surcharge, cess, total: tax + surcharge + cess }
}

function calcNewRegime(p: TaxParams, fy: FY) {
  const stdDeduction = fy === '2024-25' ? 75000 : 50000
  const gross = p.grossSalary + p.otherIncome
  const taxableIncome = Math.max(0, gross - stdDeduction)

  // New regime slabs FY 2024-25
  let tax = 0
  const slabs = fy === '2024-25'
    ? [{ up: 300000, rate: 0 }, { up: 700000, rate: 0.05 }, { up: 1000000, rate: 0.10 }, { up: 1200000, rate: 0.15 }, { up: 1500000, rate: 0.20 }, { up: Infinity, rate: 0.30 }]
    : [{ up: 250000, rate: 0 }, { up: 500000, rate: 0.05 }, { up: 750000, rate: 0.10 }, { up: 1000000, rate: 0.15 }, { up: 1250000, rate: 0.20 }, { up: 1500000, rate: 0.25 }, { up: Infinity, rate: 0.30 }]

  let prev = 0
  for (const slab of slabs) {
    if (taxableIncome <= prev) break
    const taxable = Math.min(taxableIncome, slab.up) - prev
    tax += taxable * slab.rate
    prev = slab.up
  }

  // 87A rebate: new regime ≤ 7L (FY 24-25) or ≤ 5L (FY 23-24)
  const rebateLimit = fy === '2024-25' ? 700000 : 500000
  if (taxableIncome <= rebateLimit) tax = 0

  let surcharge = 0
  if (taxableIncome > 50000000) surcharge = tax * 0.25 // New regime capped at 25%
  else if (taxableIncome > 20000000) surcharge = tax * 0.25
  else if (taxableIncome > 10000000) surcharge = tax * 0.15
  else if (taxableIncome > 5000000) surcharge = tax * 0.10

  const cess = (tax + surcharge) * 0.04

  return { taxableIncome, deductions: stdDeduction, tax, surcharge, cess, total: tax + surcharge + cess }
}

export default function TaxCalculatorPage() {
  const [fy, setFY] = useState<FY>('2024-25')
  const [age, setAge] = useState<AgeGroup>('below_60')
  const [params, setParams] = useState<TaxParams>({
    grossSalary: 1200000, otherIncome: 0, hra: 0,
    section80C: 150000, section80D: 25000, section80CCD1B: 50000,
    homeLoanInterest: 0, lta: 0, otherDeductions: 0,
  })
  const [calculated, setCalculated] = useState(false)

  const setParam = (key: keyof TaxParams, val: number) =>
    setParams((p) => ({ ...p, [key]: val }))

  const oldResult = calcOldRegime(params, fy, age)
  const newResult = calcNewRegime(params, fy)
  const savings = oldResult.total - newResult.total
  const betterRegime = savings > 0 ? 'New Regime' : savings < 0 ? 'Old Regime' : 'Equal'

  const InputField = ({ label, field, max, tooltip }: { label: string; field: keyof TaxParams; max?: number; tooltip?: string }) => (
    <div>
      <div className="flex items-center gap-1 mb-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        {max && <span className="text-xs text-slate-400">(max {formatINR(max)})</span>}
        {tooltip && (
          <span title={tooltip} className="text-slate-400 cursor-help text-xs">ℹ️</span>
        )}
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
        <input
          type="number"
          min="0"
          step="1000"
          value={params[field]}
          onChange={(e) => setParam(field, Number(e.target.value))}
          className="w-full pl-8 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
        />
      </div>
    </div>
  )

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Income Tax Calculator</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          Compare Old vs New tax regime for Indian income tax
        </p>
      </div>

      <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-400">
        ⚠️ This calculator provides estimates only. Tax rules change each financial year. Consult a qualified
        Chartered Accountant for personalised advice. Source: incometax.gov.in
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Input form */}
        <div className="lg:col-span-2 space-y-5">
          {/* FY + Age */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Financial Year</label>
              <div className="flex gap-2">
                {(['2024-25', '2023-24'] as FY[]).map((f) => (
                  <button key={f} onClick={() => setFY(f)}
                    className={`flex-1 py-2 text-sm rounded-lg font-medium transition-colors ${fy === f ? 'bg-saffron-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}>
                    FY {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Age Group</label>
              <select value={age} onChange={(e) => setAge(e.target.value as AgeGroup)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500">
                <option value="below_60">Below 60 years</option>
                <option value="60_to_80">60–80 years (Senior Citizen)</option>
                <option value="above_80">Above 80 years (Super Senior)</option>
              </select>
            </div>
          </div>

          {/* Income */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
            <h3 className="font-semibold text-slate-800 dark:text-white">Income Details</h3>
            <InputField label="Gross Annual Salary" field="grossSalary" />
            <InputField label="Other Income" field="otherIncome" tooltip="Rental income, interest, freelance, etc." />
          </div>

          {/* Deductions (Old Regime) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white">Deductions</h3>
              <p className="text-xs text-slate-400 mt-0.5">Applicable in Old Regime only (except standard deduction)</p>
            </div>
            <InputField label="HRA Exemption" field="hra" tooltip="House Rent Allowance — subject to LTA/rent conditions. Sec 10(13A)" />
            <InputField label="Section 80C" field="section80C" max={150000} tooltip="PPF, ELSS, LIC, EPF, school fees, home loan principal, NSC, etc." />
            <InputField label="Section 80D (Health Insurance)" field="section80D" max={100000} tooltip="Health insurance premium for self, spouse, children, and parents" />
            <InputField label="Section 80CCD(1B) — NPS" field="section80CCD1B" max={50000} tooltip="Additional NPS contribution beyond 80C limit" />
            <InputField label="Home Loan Interest (Sec 24)" field="homeLoanInterest" max={200000} tooltip="Interest on self-occupied home loan — max ₹2,00,000" />
            <InputField label="LTA" field="lta" tooltip="Leave Travel Allowance exemption" />
            <InputField label="Other Deductions" field="otherDeductions" />
          </div>

          <button
            onClick={() => setCalculated(true)}
            className="w-full py-3 bg-saffron-500 hover:bg-saffron-600 text-white font-bold rounded-xl transition-colors text-lg"
          >
            Calculate Tax
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-5">
          {calculated ? (
            <>
              {/* Recommendation banner */}
              <div className={`rounded-2xl p-5 ${savings > 0 ? 'bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800' : savings < 0 ? 'bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800' : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
                <p className="font-bold text-lg text-slate-800 dark:text-white">
                  {savings > 0 ? '✅ New Regime is better for you' : savings < 0 ? '✅ Old Regime is better for you' : '🟰 Both regimes result in equal tax'}
                </p>
                {Math.abs(savings) > 0 && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    You save <strong className="text-emerald-600">{formatINR(Math.abs(savings))}</strong> with the{' '}
                    <strong>{betterRegime}</strong>
                  </p>
                )}
              </div>

              {/* Comparison */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Old Regime', result: oldResult, color: 'border-blue-200 dark:border-blue-800' },
                  { label: 'New Regime', result: newResult, color: 'border-emerald-200 dark:border-emerald-800' },
                ].map(({ label, result, color }) => (
                  <div key={label} className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 ${color}`}>
                    <h3 className="font-bold text-slate-800 dark:text-white mb-4">{label}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Gross Income</span>
                        <span className="font-medium text-slate-800 dark:text-white">{formatINR(params.grossSalary + params.otherIncome)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Deductions</span>
                        <span className="font-medium text-emerald-600">−{formatINR(result.deductions)}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-2">
                        <span className="text-slate-600 font-medium">Taxable Income</span>
                        <span className="font-bold text-slate-800 dark:text-white">{formatINR(result.taxableIncome)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Income Tax</span>
                        <span className="font-medium text-rose-600">{formatINR(result.tax)}</span>
                      </div>
                      {result.surcharge > 0 && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Surcharge</span>
                          <span className="font-medium text-rose-600">{formatINR(result.surcharge)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-500">Health & Ed. Cess (4%)</span>
                        <span className="font-medium text-rose-600">{formatINR(result.cess)}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-2">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Total Tax Payable</span>
                        <span className="font-black text-rose-600 text-lg">{formatINR(result.total)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tax knowledge section */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Tax Knowledge</h3>
                <div className="space-y-3">
                  {[
                    { section: 'Section 80C', desc: 'Deduction up to ₹1,50,000 for specified investments and expenditures including PPF, ELSS mutual funds, life insurance premium, EPF, ULIP, school tuition fees, NSC, home loan principal, tax-saving FDs, and Sukanya Samriddhi.' },
                    { section: 'Section 80D', desc: 'Deduction for health insurance premium paid for self, spouse, dependent children (up to ₹25,000) and parents (up to ₹25,000 or ₹50,000 if senior citizen).' },
                    { section: 'Section 80CCD(1B)', desc: 'Additional deduction up to ₹50,000 for contribution to National Pension Scheme (NPS) — over and above the ₹1,50,000 limit under 80C.' },
                    { section: 'Section 24(b)', desc: 'Deduction of interest paid on home loan for self-occupied property — up to ₹2,00,000 per year. No limit for let-out property (subject to set-off rules).' },
                    { section: 'Standard Deduction', desc: 'A flat deduction of ₹50,000 (Old Regime) or ₹75,000 (New Regime, FY 2024-25) from salary income for salaried employees and pensioners.' },
                  ].map((item) => (
                    <details key={item.section} className="border border-slate-100 dark:border-slate-800 rounded-xl">
                      <summary className="px-4 py-3 cursor-pointer font-medium text-slate-700 dark:text-slate-300 text-sm select-none">
                        {item.section}
                      </summary>
                      <p className="px-4 pb-3 text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </details>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-4">
                  Source: <a href="https://incometax.gov.in" target="_blank" rel="noopener noreferrer" className="text-saffron-600 hover:underline">incometax.gov.in</a>{' '}
                  · Last verified: April 2025 · This is educational information only, not tax advice.
                </p>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
              <p className="text-4xl mb-3">📋</p>
              <p className="font-medium text-slate-700 dark:text-slate-300">Enter your details and click Calculate</p>
              <p className="text-sm text-slate-400 mt-1">Your regime comparison will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
