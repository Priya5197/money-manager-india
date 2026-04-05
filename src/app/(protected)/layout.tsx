'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  Receipt,
  Settings,
  Calculator,
  PiggyBank,
  Target,
  BarChart3,
  Bell,
  Trophy,
  IndianRupee,
} from 'lucide-react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: 'Transactions',
      href: '/transactions',
      icon: <Receipt className="w-5 h-5" />,
    },
    {
      label: 'Budgets',
      href: '/budgets',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      label: 'Accounts',
      href: '/accounts',
      icon: <Wallet className="w-5 h-5" />,
    },
    // ── Savings & Goals ────────────────────────────────────────────────────────
    {
      label: 'Savings Guidance',
      href: '/savings',
      icon: <PiggyBank className="w-5 h-5" />,
    },
    {
      label: 'Goals',
      href: '/goals',
      icon: <Target className="w-5 h-5" />,
    },
    {
      label: 'Net Worth',
      href: '/net-worth',
      icon: <IndianRupee className="w-5 h-5" />,
    },
    // ── Calculators ────────────────────────────────────────────────────────────
    {
      label: 'Calculators',
      href: '/calculators',
      icon: <Calculator className="w-5 h-5" />,
      submenu: [
        {
          label: 'EMI Calculator',
          href: '/calculators/emi',
          icon: <Calculator className="w-4 h-4" />,
        },
        {
          label: 'Tax Calculator',
          href: '/calculators/tax',
          icon: <BarChart3 className="w-4 h-4" />,
        },
        {
          label: 'Salary Analyser',
          href: '/calculators/salary',
          icon: <TrendingUp className="w-4 h-4" />,
        },
      ],
    },
    // ── Tools ──────────────────────────────────────────────────────────────────
    {
      label: 'Bill Reminders',
      href: '/reminders',
      icon: <Bell className="w-5 h-5" />,
    },
    {
      label: 'Challenges',
      href: '/challenges',
      icon: <Trophy className="w-5 h-5" />,
    },
    // ── Reports ────────────────────────────────────────────────────────────────
    {
      label: 'Reports',
      href: '/reports',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const userMenu = {
    name: user.email?.split('@')[0] || 'User',
    email: user.email || '',
    onLogout: () => {
      router.push('/auth/logout');
    },
  };

  return (
    <AppLayout
      navItems={navItems}
      logoLabel="Money Manager"
      userMenu={userMenu}
    >
      {children}
    </AppLayout>
  );
}
