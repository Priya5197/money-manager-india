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
