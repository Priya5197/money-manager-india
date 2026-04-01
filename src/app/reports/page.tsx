'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useTransactions';
import { useBudgets } from '@/hooks/useBudgets';
import { useCategories } from '@/hooks/useCategories';
import { useAccounts } from '@/hooks/useAccounts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { StatCard } from '@/components/ui/stat-card';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { ReportFilters, FilterState } from '@/components/reports/report-filters';
import { BarChart } from '@/components/charts/bar-chart';
import { LineChart } from '@/components/charts/line-chart';
import { AreaChart } from '@/components/charts/area-chart';
import { PieChart } from '@/components/charts/pie-chart';
import { DataTable } from '@/components/ui/data-table';
import { exportToCSV, exportToPDF } from '@/utils/export';
import {
  formatINR,
  formatDate,
  formatPercent,
  formatDateLong,
  formatMonth,
} from '@/utils/format';
import { cn } from '@/lib/cn';
import { Download, FileText } from 'lucide-react';

interface ReportData {
  monthlyIncome: Array<{ month: string; value: number }>;
  monthlyExpenses: Array<{ month: string; value: number }>;
  incomeByCategory: Array<{ category: string; amount: number }>;
  expensesByCategory: Array<{ category: string; amount: number }>;
  dailySpending: Array<{ day: string; amount: number }>;
  budgetAnalysis: Array<{
    category: string;
    budget: number;
    spent: number;
    remaining: number;
    percentage: number;
  }>;
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    savingsRate: number;
    avgDailySpend: number;
  };
}

const EMPTY_REPORT: ReportData = {
  monthlyIncome: [],
  monthlyExpenses: [],
  incomeByCategory: [],
  expensesByCategory: [],
  dailySpending: [],
  budgetAnalysis: [],
  summary: {
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    savingsRate: 0,
    avgDailySpend: 0,
  },
};

export default function ReportsPage() {
  const { user } = useAuth();
  const { transactions, loading: txLoading } = useTransactions(user?.id || '');
  const { budgets, loading: budgetLoading } = useBudgets(user?.id || '');
  const { categories } = useCategories(user?.id || '');
  const { accounts } = useAccounts(user?.id || '');

  const [filters, setFilters] = useState<FilterState>({
    dateRange: { preset: 'thisMonth', startDate: null, endDate: null },
    selectedCategories: [],
    selectedAccounts: [],
  });

  const [reportData, setReportData] = useState<ReportData>(EMPTY_REPORT);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const getDateRange = useCallback(() => {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (filters.dateRange.preset) {
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = today;
        break;
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'last3Months':
        startDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        endDate = today;
        break;
      case 'last6Months':
        startDate = new Date(today.getFullYear(), today.getMonth() - 6, 1);
        endDate = today;
        break;
      case 'thisYear':
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = today;
        break;
      case 'custom':
        if (filters.dateRange.startDate && filters.dateRange.endDate) {
          startDate = new Date(filters.dateRange.startDate);
          endDate = new Date(filters.dateRange.endDate);
        }
        break;
      default:
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = today;
    }

    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
    };
  }, [filters.dateRange]);

  const generateReport = useCallback(() => {
    if (!transactions || transactions.length === 0) {
      setReportData(EMPTY_REPORT);
      setLoading(false);
      return;
    }

    setLoading(true);
    const dateRange = getDateRange();

    // Filter transactions
    const filtered = transactions.filter((tx) => {
      const txDate = tx.date;
      if (
        filters.dateRange.preset !== 'custom' ||
        (filters.dateRange.startDate && filters.dateRange.endDate)
      ) {
        if (txDate < dateRange.start || txDate > dateRange.end) return false;
      }

      if (
        filters.selectedCategories.length > 0 &&
        !filters.selectedCategories.includes(tx.category)
      ) {
        return false;
      }

      if (
        filters.selectedAccounts.length > 0 &&
        !filters.selectedAccounts.includes(tx.accountId)
      ) {
        return false;
      }

      return true;
    });

    // Calculate summary
    let totalIncome = 0;
    let totalExpenses = 0;

    // Group by category and month
    const monthlyData: Record<string, { income: number; expenses: number }> =
      {};
    const incomeByCategory: Record<string, number> = {};
    const expensesByCategory: Record<string, number> = {};
    const dailySpending: Record<string, number> = {};

    filtered.forEach((tx) => {
      const amount = Number(tx.amount) || 0;
      const date = new Date(tx.date);
      const monthKey = formatMonth(date.getMonth() + 1, date.getFullYear());
      const dayKey = formatDate(tx.date);

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0 };
      }

      if (tx.type === 'income') {
        totalIncome += amount;
        monthlyData[monthKey].income += amount;
        incomeByCategory[tx.category] = (incomeByCategory[tx.category] || 0) + amount;
      } else if (tx.type === 'expense') {
        totalExpenses += amount;
        monthlyData[monthKey].expenses += amount;
        expensesByCategory[tx.category] = (expensesByCategory[tx.category] || 0) + amount;
        dailySpending[dayKey] = (dailySpending[dayKey] || 0) + amount;
      }
    });

    // Prepare chart data
    const monthlyIncome = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      value: data.income,
    }));

    const monthlyExpenses = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      value: data.expenses,
    }));

    const incomeByChart = Object.entries(incomeByCategory)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    const expensesByChart = Object.entries(expensesByCategory)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    const dailyData = Object.entries(dailySpending)
      .map(([day, amount]) => ({ day, amount }))
      .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

    // Budget analysis
    const budgetAnalysis = budgets.map((budget) => {
      const spent = expensesByCategory[budget.category] || 0;
      const budgetAmount = Number(budget.limit) || 0;
      return {
        category: budget.category,
        budget: budgetAmount,
        spent,
        remaining: Math.max(0, budgetAmount - spent),
        percentage: budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0,
      };
    });

    const netSavings = totalIncome - totalExpenses;
    const savingsRate =
      totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
    const dayCount = Object.keys(dailySpending).length;
    const avgDailySpend = dayCount > 0 ? totalExpenses / dayCount : 0;

    setReportData({
      monthlyIncome,
      monthlyExpenses,
      incomeByCategory: incomeByChart,
      expensesByCategory: expensesByChart,
      dailySpending: dailyData,
      budgetAnalysis,
      summary: {
        totalIncome,
        totalExpenses,
        netSavings,
        savingsRate,
        avgDailySpend,
      },
    });

    setLoading(false);
  }, [transactions, filters, getDateRange, budgets]);

  useEffect(() => {
    generateReport();
  }, [generateReport]);

  const handleExportCSV = () => {
    const dateRange = getDateRange();
    const data = reportData.expensesByCategory.map((cat) => ({
      Category: cat.category,
      Amount: cat.amount,
      Percentage: `${((cat.amount / reportData.summary.totalExpenses) * 100).toFixed(1)}%`,
    }));

    exportToCSV(
      data,
      `expenses-report-${dateRange.start}-to-${dateRange.end}.csv`
    );
  };

  const handleExportPDF = () => {
    const dateRange = getDateRange();
    const data = [
      {
        Metric: 'Total Income',
        Amount: formatINR(reportData.summary.totalIncome),
      },
      {
        Metric: 'Total Expenses',
        Amount: formatINR(reportData.summary.totalExpenses),
      },
      {
        Metric: 'Net Savings',
        Amount: formatINR(reportData.summary.netSavings),
      },
      {
        Metric: 'Savings Rate',
        Amount: `${formatPercent(reportData.summary.savingsRate)}`,
      },
    ];

    exportToPDF(
      'Financial Report',
      data,
      [
        { header: 'Metric', dataKey: 'Metric' },
        { header: 'Amount', dataKey: 'Amount' },
      ],
      `financial-report-${dateRange.start}-to-${dateRange.end}.pdf`,
      {
        companyName: 'Money Manager India',
        footer: '© Money Manager India - Confidential',
      }
    );
  };

  if (txLoading || budgetLoading) {
    return <Loading />;
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        </div>
        <EmptyState
          title="No transactions yet"
          description="Start adding transactions to see detailed reports and analytics."
          action={{
            label: 'Add Transaction',
            href: '/transactions',
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-gray-600">
            Analyze your spending patterns and financial trends
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ReportFilters
            onFiltersChange={setFilters}
            categories={categories.map((c) => ({ id: c.id, name: c.name }))}
            accounts={accounts.map((a) => ({ id: a.id, name: a.name }))}
          />
        </div>

        {/* Main Content */}
        <div className="space-y-6 lg:col-span-3">
          {loading ? (
            <Loading />
          ) : (
            <>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                tabs={[
                  { id: 'overview', label: 'Overview' },
                  { id: 'income', label: 'Income' },
                  { id: 'expenses', label: 'Expenses' },
                  { id: 'budget', label: 'Budget Analysis' },
                  { id: 'trends', label: 'Trends' },
                ]}
              />

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <StatCard
                      label="Total Income"
                      value={formatINR(reportData.summary.totalIncome)}
                      trend={reportData.summary.totalIncome > 0 ? 'up' : 'neutral'}
                    />
                    <StatCard
                      label="Total Expenses"
                      value={formatINR(reportData.summary.totalExpenses)}
                      trend="down"
                    />
                    <StatCard
                      label="Net Savings"
                      value={formatINR(reportData.summary.netSavings)}
                      trend={reportData.summary.netSavings > 0 ? 'up' : 'down'}
                    />
                    <StatCard
                      label="Savings Rate"
                      value={formatPercent(reportData.summary.savingsRate)}
                      trend={reportData.summary.savingsRate > 20 ? 'up' : 'neutral'}
                    />
                    <StatCard
                      label="Avg Daily Spend"
                      value={formatINR(reportData.summary.avgDailySpend)}
                      trend="neutral"
                    />
                  </div>

                  {/* Charts */}
                  <div className="grid gap-6 lg:grid-cols-2">
                    {reportData.monthlyIncome.length > 0 &&
                      reportData.monthlyExpenses.length > 0 && (
                        <Card className="p-6">
                          <h3 className="mb-4 font-semibold text-gray-900">
                            Income vs Expenses
                          </h3>
                          <AreaChart
                            data={{
                              labels: reportData.monthlyIncome.map((d) => d.month),
                              datasets: [
                                {
                                  label: 'Income',
                                  data: reportData.monthlyIncome.map((d) => d.value),
                                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                  borderColor: '#22c55e',
                                  fill: true,
                                  tension: 0.3,
                                },
                                {
                                  label: 'Expenses',
                                  data: reportData.monthlyExpenses.map((d) => d.value),
                                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  borderColor: '#ef4444',
                                  fill: true,
                                  tension: 0.3,
                                },
                              ],
                            }}
                          />
                        </Card>
                      )}

                    {reportData.monthlyIncome.length > 0 && (
                      <Card className="p-6">
                        <h3 className="mb-4 font-semibold text-gray-900">
                          Monthly Trend
                        </h3>
                        <LineChart
                          data={{
                            labels: reportData.monthlyIncome.map((d) => d.month),
                            datasets: [
                              {
                                label: 'Net Savings',
                                data: reportData.monthlyIncome.map((d, i) =>
                                  d.value - (reportData.monthlyExpenses[i]?.value || 0)
                                ),
                                borderColor: '#3b82f6',
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                tension: 0.3,
                              },
                            ],
                          }}
                        />
                      </Card>
                    )}
                  </div>
                </div>
              )}

              {/* Income Tab */}
              {activeTab === 'income' && (
                <div className="space-y-6">
                  {reportData.incomeByCategory.length > 0 ? (
                    <>
                      <Card className="p-6">
                        <h3 className="mb-4 font-semibold text-gray-900">
                          Income by Source
                        </h3>
                        <BarChart
                          data={{
                            labels: reportData.incomeByCategory.map((d) => d.category),
                            datasets: [
                              {
                                label: 'Amount',
                                data: reportData.incomeByCategory.map((d) => d.value),
                                backgroundColor: '#10b981',
                              },
                            ],
                          }}
                        />
                      </Card>

                      <Card className="p-6">
                        <h3 className="mb-4 font-semibold text-gray-900">
                          Income Breakdown
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="border-b bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                                  Source
                                </th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-900">
                                  Amount
                                </th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-900">
                                  % of Total
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {reportData.incomeByCategory.map((item) => (
                                <tr
                                  key={item.category}
                                  className="border-b hover:bg-gray-50"
                                >
                                  <td className="px-4 py-3 text-gray-900">
                                    {item.category}
                                  </td>
                                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                                    {formatINR(item.amount)}
                                  </td>
                                  <td className="px-4 py-3 text-right text-gray-600">
                                    {formatPercent(
                                      (item.amount /
                                        reportData.summary.totalIncome) *
                                      100
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Card>
                    </>
                  ) : (
                    <EmptyState title="No income data" description="Add income transactions to see analysis." />
                  )}
                </div>
              )}

              {/* Expenses Tab */}
              {activeTab === 'expenses' && (
                <div className="space-y-6">
                  {reportData.expensesByCategory.length > 0 ? (
                    <>
                      <div className="grid gap-6 lg:grid-cols-2">
                        <Card className="p-6">
                          <h3 className="mb-4 font-semibold text-gray-900">
                            Expenses by Category
                          </h3>
                          {reportData.expensesByCategory.length > 0 && (
                            <PieChart
                              data={{
                                labels: reportData.expensesByCategory.map(
                                  (d) => d.category
                                ),
                                data: reportData.expensesByCategory.map(
                                  (d) => d.amount
                                ),
                                backgroundColor: [
                                  '#ef4444',
                                  '#f97316',
                                  '#eab308',
                                  '#84cc16',
                                  '#22c55e',
                                  '#06b6d4',
                                  '#0ea5e9',
                                  '#3b82f6',
                                  '#8b5cf6',
                                  '#d946ef',
                                ],
                              }}
                            />
                          )}
                        </Card>

                        <Card className="p-6">
                          <h3 className="mb-4 font-semibold text-gray-900">
                            Top 5 Categories
                          </h3>
                          <BarChart
                            data={{
                              labels: reportData.expensesByCategory
                                .slice(0, 5)
                                .map((d) => d.category),
                              datasets: [
                                {
                                  label: 'Amount',
                                  data: reportData.expensesByCategory
                                    .slice(0, 5)
                                    .map((d) => d.value),
                                  backgroundColor: '#ef4444',
                                },
                              ],
                            }}
                          />
                        </Card>
                      </div>

                      <Card className="p-6">
                        <h3 className="mb-4 font-semibold text-gray-900">
                          Category Breakdown
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="border-b bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                                  Category
                                </th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-900">
                                  Amount
                                </th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-900">
                                  % of Total
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {reportData.expensesByCategory.map((item) => (
                                <tr
                                  key={item.category}
                                  className="border-b hover:bg-gray-50"
                                >
                                  <td className="px-4 py-3 text-gray-900">
                                    {item.category}
                                  </td>
                                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                                    {formatINR(item.amount)}
                                  </td>
                                  <td className="px-4 py-3 text-right text-gray-600">
                                    {formatPercent(
                                      (item.amount /
                                        reportData.summary.totalExpenses) *
                                      100
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Card>
                    </>
                  ) : (
                    <EmptyState title="No expense data" description="Add expenses to see analysis." />
                  )}
                </div>
              )}

              {/* Budget Analysis Tab */}
              {activeTab === 'budget' && (
                <div className="space-y-6">
                  {reportData.budgetAnalysis.length > 0 ? (
                    <>
                      <Card className="p-6">
                        <h3 className="mb-4 font-semibold text-gray-900">
                          Budget vs Actual
                        </h3>
                        <BarChart
                          data={{
                            labels: reportData.budgetAnalysis.map((d) => d.category),
                            datasets: [
                              {
                                label: 'Budget',
                                data: reportData.budgetAnalysis.map((d) => d.budget),
                                backgroundColor: '#3b82f6',
                              },
                              {
                                label: 'Spent',
                                data: reportData.budgetAnalysis.map((d) => d.spent),
                                backgroundColor: '#ef4444',
                              },
                            ],
                          }}
                        />
                      </Card>

                      <Card className="p-6">
                        <h3 className="mb-4 font-semibold text-gray-900">
                          Budget Utilization
                        </h3>
                        <div className="space-y-4">
                          {reportData.budgetAnalysis.map((item) => (
                            <div key={item.category} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {item.category}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {formatINR(item.spent)} of{' '}
                                    {formatINR(item.budget)}
                                  </p>
                                </div>
                                <Badge
                                  variant={
                                    item.percentage > 100
                                      ? 'destructive'
                                      : item.percentage > 80
                                        ? 'warning'
                                        : 'success'
                                  }
                                >
                                  {formatPercent(item.percentage)}
                                </Badge>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                                <div
                                  className={cn(
                                    'h-full transition-all',
                                    item.percentage > 100
                                      ? 'bg-red-500'
                                      : item.percentage > 80
                                        ? 'bg-yellow-500'
                                        : 'bg-green-500'
                                  )}
                                  style={{
                                    width: `${Math.min(100, item.percentage)}%`,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </>
                  ) : (
                    <EmptyState title="No budget data" description="Set up budgets to see analysis." />
                  )}
                </div>
              )}

              {/* Trends Tab */}
              {activeTab === 'trends' && (
                <div className="space-y-6">
                  {reportData.monthlyIncome.length > 0 && (
                    <>
                      <Card className="p-6">
                        <h3 className="mb-4 font-semibold text-gray-900">
                          Monthly Net Savings Trend
                        </h3>
                        <LineChart
                          data={{
                            labels: reportData.monthlyIncome.map((d) => d.month),
                            datasets: [
                              {
                                label: 'Net Savings',
                                data: reportData.monthlyIncome.map((d, i) =>
                                  d.value - (reportData.monthlyExpenses[i]?.value || 0)
                                ),
                                borderColor: '#3b82f6',
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                fill: true,
                                tension: 0.3,
                              },
                            ],
                          }}
                        />
                      </Card>

                      {reportData.expensesByCategory.slice(0, 5).length > 0 && (
                        <Card className="p-6">
                          <h3 className="mb-4 font-semibold text-gray-900">
                            Top 5 Expense Categories Trend
                          </h3>
                          <LineChart
                            data={{
                              labels: reportData.monthlyIncome.map((d) => d.month),
                              datasets: reportData.expensesByCategory
                                .slice(0, 5)
                                .map((cat, idx) => ({
                                  label: cat.category,
                                  data: Array(reportData.monthlyIncome.length).fill(
                                    cat.amount /
                                    reportData.monthlyIncome.length
                                  ),
                                  borderColor: [
                                    '#ef4444',
                                    '#f97316',
                                    '#eab308',
                                    '#84cc16',
                                    '#22c55e',
                                  ][idx],
                                  tension: 0.3,
                                })),
                            }}
                          />
                        </Card>
                      )}

                      <Card className="p-6">
                        <h3 className="mb-4 font-semibold text-gray-900">
                          Income Growth Trend
                        </h3>
                        <LineChart
                          data={{
                            labels: reportData.monthlyIncome.map((d) => d.month),
                            datasets: [
                              {
                                label: 'Income',
                                data: reportData.monthlyIncome.map((d) => d.value),
                                borderColor: '#10b981',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                fill: true,
                                tension: 0.3,
                              },
                            ],
                          }}
                        />
                      </Card>
                    </>
                  ) : (
                    <EmptyState title="No trend data" description="Add more transactions to see trends." />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
