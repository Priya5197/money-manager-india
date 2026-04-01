import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator, TrendingUp, FileText } from 'lucide-react';

const calculators = [
  {
    id: 'emi',
    title: 'EMI Calculator',
    description:
      'Calculate EMI for loans and compare different offers. Includes prepayment options and amortization schedules.',
    icon: Calculator,
    color: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400',
    href: '/calculators/emi',
    features: [
      'Multiple loan types',
      'Loan comparison',
      'Amortization schedule',
      'Export to CSV/PDF',
    ],
  },
  {
    id: 'tax',
    title: 'Tax Calculator',
    description:
      'Calculate income tax for both old and new regimes. Compare and get recommendations based on your income and deductions.',
    icon: FileText,
    color: 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400',
    href: '/calculators/tax',
    features: [
      'Old & New regime',
      'Tax comparison',
      'Deduction guide',
      'Export report',
    ],
  },
  {
    id: 'salary',
    title: 'Salary Analyzer',
    description:
      'Analyze salary growth, predict future earnings, and plan for career progression with detailed insights.',
    icon: TrendingUp,
    color: 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400',
    href: '/calculators/salary',
    features: [
      'Growth analysis',
      '5-year forecast',
      'CAGR calculation',
      'Lifetime projection',
    ],
  },
];

export const metadata = {
  title: 'Financial Calculators | Money Manager India',
  description: 'Calculate EMI, income tax, and analyze salary growth with our comprehensive financial tools.',
};

export default function CalculatorsPage() {
  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Financial Calculators
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Powerful tools to help you make informed financial decisions
        </p>
      </div>

      {/* Calculator Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {calculators.map((calculator) => {
          const IconComponent = calculator.icon;
          return (
            <Link key={calculator.id} href={calculator.href}>
              <Card
                className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg"
                hoverable
              >
                <CardHeader>
                  <div className="space-y-4">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${calculator.color}`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                      {calculator.title}
                    </h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {calculator.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                      Features
                    </p>
                    <ul className="space-y-1">
                      {calculator.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                        >
                          <div className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Button
                    variant="primary"
                    className="w-full mt-4 group"
                  >
                    Open Calculator
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Help Section */}
      <Card className="mt-12">
        <CardHeader title="Need Help?" description="Learn more about our calculators" />
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 dark:text-slate-50">
                EMI Calculator
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Perfect for planning loans, comparing offers, and understanding the total cost
                of borrowing.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 dark:text-slate-50">
                Tax Calculator
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Get accurate tax calculations and recommendations to optimize your tax liability
                every year.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 dark:text-slate-50">
                Salary Analyzer
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Analyze growth patterns and predict future salary based on historical trends and
                industry standards.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
