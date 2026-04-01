'use client';

import React, { useState, useMemo } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/ui/stat-card';
import { DataTable } from '@/components/ui/data-table';
import { Switch } from '@/components/ui/switch';
import { BarChart } from '@/components/charts/bar-chart';
import { PieChart } from '@/components/charts/pie-chart';
import { Trash2, Plus, Download } from 'lucide-react';
import {
  calculateEMI,
  calculateTotalInterest,
  calculateTotalRepayment,
  generateAmortizationSchedule,
  compareLoanOffers,
  estimateRateByScore,
  type LoanOffer,
  type EMIMonthDetail,
} from '@/utils/calculations/emi';
import { formatINR, formatPercent } from '@/utils/format';
import { exportToCSV, exportToPDF } from '@/utils/export';
import { cn } from '@/lib/cn';

type LoanType = 'home' | 'personal' | 'vehicle' | 'education' | 'property';

const loanTypes: { value: LoanType; label: string }[] = [
  { value: 'home', label: 'Home Loan' },
  { value: 'personal', label: 'Personal Loan' },
  { value: 'vehicle', label: 'Vehicle Loan' },
  { value: 'education', label: 'Education Loan' },
  { value: 'property', label: 'Property Loan' },
];

const cibilRanges = [
  { value: '300-549', label: '300-549 (Very Poor)', rate: 18.0 },
  { value: '550-649', label: '550-649 (Poor)', rate: 15.0 },
  { value: '650-749', label: '650-749 (Fair)', rate: 12.5 },
  { value: '750-799', label: '750-799 (Good)', rate: 10.5 },
  { value: '800-900', label: '800-900 (Excellent)', rate: 8.5 },
];

export default function EMICalculatorPage() {
  const [loanType, setLoanType] = useState<LoanType>('home');
  const [principal, setPrincipal] = useState<number>(5000000);
  const [rate, setRate] = useState<number>(7.5);
  const [tenureMonths, setTenureMonths] = useState<number>(240);
  const [isTenureInYears, setIsTenureInYears] = useState(false);
  const [processingFee, setProcessingFee] = useState<number>(50000);
  const [processingFeePercent, setProcessingFeePercent] = useState(false);
  const [insurance, setInsurance] = useState<number>(0);
  const [prepaymentMonth, setPrepaymentMonth] = useState<number>(0);
  const [prepaymentAmount, setPrepaymentAmount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Loan Comparison
  const [loanOffers, setLoanOffers] = useState<
    Array<LoanOffer & { id: string }>
  >([]);
  const [offerBankName, setOfferBankName] = useState('');
  const [offerRate, setOfferRate] = useState<number>(7.5);
  const [offerTenureMonths, setOfferTenureMonths] = useState<number>(240);
  const [offerProcessingFee, setOfferProcessingFee] = useState<number>(0);

  // CIBIL Rate Estimation
  const [selectedCibilRange, setSelectedCibilRange] = useState('800-900');

  // Calculate display tenure
  const displayTenure = isTenureInYears ? tenureMonths * 12 : tenureMonths;

  // Calculate processing fee amount
  const actualProcessingFee = processingFeePercent
    ? Math.round((principal * processingFee) / 100)
    : processingFee;

  // Generate amortization schedule with prepayment
  const prepayments = new Map<number, number>();
  if (prepaymentMonth > 0 && prepaymentAmount > 0) {
    prepayments.set(prepaymentMonth, prepaymentAmount);
  }

  const schedule = useMemo(() => {
    try {
      return generateAmortizationSchedule(principal, rate, displayTenure, prepayments);
    } catch {
      return [];
    }
  }, [principal, rate, displayTenure, prepayments]);

  // Calculate EMI results
  const emi = useMemo(() => {
    try {
      return calculateEMI(principal, rate, displayTenure);
    } catch {
      return 0;
    }
  }, [principal, rate, displayTenure]);

  const totalInterest = useMemo(() => {
    try {
      return calculateTotalInterest(principal, rate, displayTenure);
    } catch {
      return 0;
    }
  }, [principal, rate, displayTenure]);

  const totalRepayment = useMemo(() => {
    try {
      return calculateTotalRepayment(
        principal,
        rate,
        displayTenure,
        actualProcessingFee,
        insurance
      );
    } catch {
      return 0;
    }
  }, [principal, rate, displayTenure, actualProcessingFee, insurance]);

  const effectiveCost = actualProcessingFee + insurance;

  // Pie chart data for principal vs interest
  const pieData = [
    { name: 'Principal', value: principal },
    { name: 'Interest', value: totalInterest },
  ];

  // Add loan offer
  const addLoanOffer = () => {
    if (offerBankName.trim()) {
      const newOffer: LoanOffer & { id: string } = {
        id: Date.now().toString(),
        name: offerBankName,
        principal,
        rate: offerRate,
        tenureMonths: offerTenureMonths,
        processingFee: offerProcessingFee,
      };
      if (loanOffers.length < 3) {
        setLoanOffers([...loanOffers, newOffer]);
        setOfferBankName('');
        setOfferRate(7.5);
        setOfferTenureMonths(240);
        setOfferProcessingFee(0);
      }
    }
  };

  // Remove loan offer
  const removeLoanOffer = (id: string) => {
    setLoanOffers(loanOffers.filter((offer) => offer.id !== id));
  };

  // Compare loan offers
  const loanComparisons = useMemo(() => {
    return compareLoanOffers(loanOffers);
  }, [loanOffers]);

  // Prepare comparison chart data
  const comparisonChartData = useMemo(() => {
    return loanComparisons.map((comp) => ({
      name: comp.offer.name,
      EMI: Math.round(comp.emi),
      Interest: Math.round(comp.totalInterest),
      'Total Cost': Math.round(comp.totalRepayment),
    }));
  }, [loanComparisons]);

  // Get estimated rate for CIBIL score
  const estimatedRate = useMemo(() => {
    const scoreRange = selectedCibilRange.split('-');
    const midScore = (parseInt(scoreRange[0]) + parseInt(scoreRange[1])) / 2;
    return estimateRateByScore(midScore, loanType === 'property' ? 'home' : (loanType as 'home' | 'personal' | 'auto'));
  }, [selectedCibilRange, loanType]);

  // Prepare amortization table columns
  const amortizationColumns = [
    {
      accessorKey: 'month',
      header: 'Month',
      cell: (info: any) => info.getValue(),
    },
    {
      accessorKey: 'emi',
      header: 'EMI',
      cell: (info: any) => formatINR(info.getValue()),
    },
    {
      accessorKey: 'principal',
      header: 'Principal',
      cell: (info: any) => formatINR(info.getValue()),
    },
    {
      accessorKey: 'interest',
      header: 'Interest',
      cell: (info: any) => formatINR(info.getValue()),
    },
    {
      accessorKey: 'balance',
      header: 'Balance',
      cell: (info: any) => formatINR(info.getValue()),
    },
    {
      accessorKey: 'prepayment',
      header: 'Prepayment',
      cell: (info: any) => {
        const value = info.getValue();
        return value ? formatINR(value) : '-';
      },
    },
  ];

  // Export amortization schedule to CSV
  const exportScheduleToCSV = () => {
    const csvData = schedule.map((row) => ({
      Month: row.month,
      EMI: row.emi.toFixed(2),
      Principal: row.principal.toFixed(2),
      Interest: row.interest.toFixed(2),
      Balance: row.balance.toFixed(2),
      Prepayment: row.prepayment ? row.prepayment.toFixed(2) : '-',
    }));
    exportToCSV(csvData, `emi-schedule-${loanType}.csv`);
  };

  // Export amortization schedule to PDF
  const exportScheduleToPDF = () => {
    const columns = [
      { header: 'Month', dataKey: 'Month' },
      { header: 'EMI', dataKey: 'EMI' },
      { header: 'Principal', dataKey: 'Principal' },
      { header: 'Interest', dataKey: 'Interest' },
      { header: 'Balance', dataKey: 'Balance' },
      { header: 'Prepayment', dataKey: 'Prepayment' },
    ];

    const data = schedule.map((row) => ({
      Month: row.month.toString(),
      EMI: formatINR(row.emi),
      Principal: formatINR(row.principal),
      Interest: formatINR(row.interest),
      Balance: formatINR(row.balance),
      Prepayment: row.prepayment ? formatINR(row.prepayment) : '-',
    }));

    exportToPDF(
      `${loanType.charAt(0).toUpperCase() + loanType.slice(1)} Loan - Amortization Schedule`,
      data,
      columns,
      `emi-schedule-${loanType}.pdf`,
      {
        companyName: 'Money Manager India',
        footer: 'EMI Calculator - Amortization Schedule',
      }
    );
  };

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          EMI Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Calculate EMI, compare loan offers, and analyze full amortization schedules
        </p>
      </div>

      {/* Main Calculator Tabs */}
      <Tabs
        defaultValue="home"
        value={loanType}
        onValueChange={(value) => setLoanType(value as LoanType)}
      >
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {loanTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setLoanType(type.value)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors',
                loanType === type.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600'
              )}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Calculator Form */}
        <Card className="mb-8">
          <CardHeader title="Loan Details" />
          <CardContent className="space-y-6">
            {/* Principal Amount */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-50">
                  Principal Amount (₹)
                </label>
                <Input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
                  placeholder="5000000"
                  min="0"
                />
              </div>

              {/* Interest Rate */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-50">
                  Annual Interest Rate (%)
                </label>
                <Input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                  placeholder="7.5"
                  step="0.01"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Tenure */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-50">
                  Tenure ({isTenureInYears ? 'Years' : 'Months'})
                </label>
                <Input
                  type="number"
                  value={isTenureInYears ? Math.ceil(tenureMonths / 12) : tenureMonths}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setTenureMonths(isTenureInYears ? value * 12 : value);
                  }}
                  placeholder="240"
                  min="1"
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Months</span>
                  <Switch
                    checked={isTenureInYears}
                    onChange={setIsTenureInYears}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Years</span>
                </div>
              </div>
            </div>

            {/* Processing Fee & Insurance */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-50">
                  Processing Fee ({processingFeePercent ? '%' : '₹'})
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={processingFee}
                    onChange={(e) => setProcessingFee(parseFloat(e.target.value) || 0)}
                    placeholder="50000"
                    min="0"
                    className="flex-1"
                  />
                  <button
                    onClick={() => setProcessingFeePercent(!processingFeePercent)}
                    className="px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-sm font-medium"
                  >
                    {processingFeePercent ? '%' : '₹'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-50">
                  Insurance (₹) <span className="text-xs text-slate-500">Optional</span>
                </label>
                <Input
                  type="number"
                  value={insurance}
                  onChange={(e) => setInsurance(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            {/* Prepayment Option */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-50 mb-4">
                Optional Prepayment
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm text-slate-600 dark:text-slate-400">
                    Prepayment Month
                  </label>
                  <Input
                    type="number"
                    value={prepaymentMonth}
                    onChange={(e) => setPrepaymentMonth(parseFloat(e.target.value) || 0)}
                    placeholder="12"
                    min="0"
                    max={displayTenure}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-slate-600 dark:text-slate-400">
                    Prepayment Amount (₹)
                  </label>
                  <Input
                    type="number"
                    value={prepaymentAmount}
                    onChange={(e) => setPrepaymentAmount(parseFloat(e.target.value) || 0)}
                    placeholder="100000"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {emi > 0 && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <StatCard
                label="Monthly EMI"
                value={formatINR(emi)}
                highlight
                size="lg"
              />
              <StatCard
                label="Total Interest"
                value={formatINR(totalInterest)}
                color="text-orange-600 dark:text-orange-400"
              />
              <StatCard
                label="Total Repayment"
                value={formatINR(emi * displayTenure)}
                color="text-green-600 dark:text-green-400"
              />
              <StatCard
                label="Processing Fee"
                value={formatINR(actualProcessingFee)}
                color="text-red-600 dark:text-red-400"
              />
              <StatCard
                label="Total Cost"
                value={formatINR(totalRepayment)}
                color="text-purple-600 dark:text-purple-400"
              />
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Pie Chart */}
              <Card>
                <CardHeader title="Principal vs Interest" />
                <CardContent className="flex justify-center">
                  <PieChart
                    data={pieData}
                    config={{
                      COLORS: ['#3b82f6', '#f97316'],
                    }}
                  />
                </CardContent>
              </Card>

              {/* Summary Card */}
              <Card>
                <CardHeader title="Loan Summary" />
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Loan Type</span>
                    <Badge>{loanType}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Principal</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-50">
                      {formatINR(principal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Interest Rate</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-50">
                      {formatPercent(rate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Tenure</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-50">
                      {displayTenure} months ({Math.round(displayTenure / 12)} years)
                    </span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Monthly EMI</span>
                      <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                        {formatINR(emi)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Amortization Schedule */}
            <Card>
              <CardHeader
                title="Amortization Schedule"
                action={
                  <div className="flex gap-2">
                    <Button
                      onClick={exportScheduleToCSV}
                      variant="secondary"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      CSV
                    </Button>
                    <Button
                      onClick={exportScheduleToPDF}
                      variant="secondary"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                }
              />
              <CardContent noPadding>
                <DataTable
                  columns={amortizationColumns}
                  data={schedule}
                  paginated
                  pageSize={10}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </Tabs>

      {/* Loan Comparison Section */}
      <Card>
        <CardHeader
          title="Compare Loan Offers"
          description="Add up to 3 loan offers to compare"
        />
        <CardContent className="space-y-6">
          {/* Add Loan Offer Form */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-4">
            <div className="grid gap-4 md:grid-cols-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  Bank Name
                </label>
                <Input
                  value={offerBankName}
                  onChange={(e) => setOfferBankName(e.target.value)}
                  placeholder="Bank Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  Rate (%)
                </label>
                <Input
                  type="number"
                  value={offerRate}
                  onChange={(e) => setOfferRate(parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  Tenure (Months)
                </label>
                <Input
                  type="number"
                  value={offerTenureMonths}
                  onChange={(e) => setOfferTenureMonths(parseFloat(e.target.value) || 0)}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  Processing Fee (₹)
                </label>
                <Input
                  type="number"
                  value={offerProcessingFee}
                  onChange={(e) => setOfferProcessingFee(parseFloat(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={addLoanOffer}
                  disabled={loanOffers.length >= 3}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Offer
                </Button>
              </div>
            </div>
          </div>

          {/* Loan Offers List */}
          {loanOffers.length > 0 && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loanOffers.map((offer, idx) => (
                  <div
                    key={offer.id}
                    className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-50">
                          {offer.name}
                        </p>
                        <p className="text-xs text-slate-500">Offer {idx + 1}</p>
                      </div>
                      <button
                        onClick={() => removeLoanOffer(offer.id)}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-950 rounded text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Rate:</span>
                        <span className="font-medium">{offer.rate.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Tenure:</span>
                        <span className="font-medium">{offer.tenureMonths} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Fee:</span>
                        <span className="font-medium">{formatINR(offer.processingFee || 0)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison Results */}
              {loanComparisons.length > 0 && (
                <div className="space-y-4 mt-6">
                  {/* Comparison Chart */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-4">
                      Comparison Chart
                    </h4>
                    <BarChart
                      data={comparisonChartData}
                      config={{
                        EMI: '#3b82f6',
                        Interest: '#f97316',
                        'Total Cost': '#10b981',
                      }}
                    />
                  </div>

                  {/* Comparison Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="text-left p-3 font-semibold text-slate-900 dark:text-slate-50">
                            Bank
                          </th>
                          <th className="text-right p-3 font-semibold text-slate-900 dark:text-slate-50">
                            EMI
                          </th>
                          <th className="text-right p-3 font-semibold text-slate-900 dark:text-slate-50">
                            Total Interest
                          </th>
                          <th className="text-right p-3 font-semibold text-slate-900 dark:text-slate-50">
                            Total Cost
                          </th>
                          <th className="text-center p-3 font-semibold text-slate-900 dark:text-slate-50">
                            Best Option
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {loanComparisons.map((comp, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                          >
                            <td className="p-3 font-medium text-slate-900 dark:text-slate-50">
                              {comp.offer.name}
                            </td>
                            <td className="text-right p-3 font-semibold text-slate-900 dark:text-slate-50">
                              {formatINR(comp.emi)}
                            </td>
                            <td className="text-right p-3 text-slate-600 dark:text-slate-400">
                              {formatINR(comp.totalInterest)}
                            </td>
                            <td className="text-right p-3 text-slate-600 dark:text-slate-400">
                              {formatINR(comp.totalRepayment)}
                            </td>
                            <td className="text-center p-3">
                              {idx === 0 && (
                                <Badge variant="success" size="sm">
                                  Best
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* CIBIL Rate Estimation Section */}
      <Card>
        <CardHeader
          title="CIBIL Score Rate Estimation"
          description="Get estimated interest rates based on your CIBIL score"
        />
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-slate-50">
                CIBIL Score Range
              </label>
              <Select
                value={selectedCibilRange}
                onChange={setSelectedCibilRange}
                options={cibilRanges.map((r) => ({
                  value: r.value,
                  label: r.label,
                }))}
              />
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Estimated Rate for {loanType}
                </p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-1">
                  {estimatedRate.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* Rate Bands Table */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
              Rate Bands by Score
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left p-2 font-semibold">Score Range</th>
                    <th className="text-left p-2 font-semibold">Category</th>
                    <th className="text-left p-2 font-semibold">Est. Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {cibilRanges.map((range) => (
                    <tr
                      key={range.value}
                      className={cn(
                        'border-b border-slate-200 dark:border-slate-700',
                        selectedCibilRange === range.value
                          ? 'bg-blue-50 dark:bg-blue-950/30'
                          : ''
                      )}
                    >
                      <td className="p-2">{range.value}</td>
                      <td className="p-2 text-slate-600 dark:text-slate-400">
                        {range.label.split('(')[1]?.replace(')', '')}
                      </td>
                      <td className="p-2 font-semibold">{range.rate.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-xs text-yellow-700 dark:text-yellow-400">
                <strong>Disclaimer:</strong> This is indicative only. Actual rates depend on
                lender assessment, loan amount, tenure, and other eligibility criteria.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Rates Section */}
      <Card>
        <CardHeader
          title="Live Bank Rates"
          description="Current EMI rates from major Indian banks"
        />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left p-3 font-semibold">Bank</th>
                  <th className="text-left p-3 font-semibold">Min Rate</th>
                  <th className="text-left p-3 font-semibold">Max Rate</th>
                  <th className="text-left p-3 font-semibold">Processing Fee</th>
                  <th className="text-left p-3 font-semibold">Last Verified</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { bank: 'HDFC Bank', min: 6.5, max: 8.5, fee: '0.50%' },
                  { bank: 'ICICI Bank', min: 6.75, max: 8.75, fee: '0.50%' },
                  { bank: 'SBI', min: 6.5, max: 8.5, fee: '0.40%' },
                  { bank: 'Axis Bank', min: 6.9, max: 9.0, fee: '0.60%' },
                  { bank: 'Kotak Bank', min: 7.0, max: 9.25, fee: '0.60%' },
                ].map((rate, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                  >
                    <td className="p-3 font-medium">{rate.bank}</td>
                    <td className="p-3">{rate.min.toFixed(2)}%</td>
                    <td className="p-3">{rate.max.toFixed(2)}%</td>
                    <td className="p-3">{rate.fee}</td>
                    <td className="p-3 text-slate-500 text-xs">31 Mar 2026</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-400">
              <strong>Note:</strong> Please verify current rates with banks before applying.
              Rates may change and vary based on your profile and eligibility.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
