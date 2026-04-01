'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { Sidebar } from './sidebar';
import { Header } from './header';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  submenu?: NavItem[];
}

interface AppLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  logo?: React.ReactNode;
  logoLabel?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  userProfile?: {
    name: string;
    email: string;
    avatar?: string;
  };
  userMenu?: {
    name: string;
    email: string;
    avatar?: string;
    onProfile?: () => void;
    onSettings?: () => void;
    onLogout?: () => void;
  };
  onLogout?: () => void;
  containerClassName?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  navItems,
  logo,
  logoLabel,
  headerTitle,
  headerSubtitle,
  showSearch = true,
  onSearch,
  userProfile,
  userMenu,
  onLogout,
  containerClassName,
}) => {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <Sidebar
        navItems={navItems}
        logo={logo}
        logoLabel={logoLabel}
        userProfile={userProfile}
        onLogout={onLogout}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        {/* Header */}
        <Header
          title={headerTitle}
          subtitle={headerSubtitle}
          showSearch={showSearch}
          onSearch={onSearch}
          userMenu={userMenu}
        />

        {/* Content area */}
        <main className="flex-1 overflow-y-auto">
          <div
            className={cn(
              'w-full h-full px-6 py-6',
              'md:px-8 md:py-8',
              containerClassName
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

AppLayout.displayName = 'AppLayout';
