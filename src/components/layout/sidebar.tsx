'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  submenu?: NavItem[];
}

interface SidebarProps {
  navItems: NavItem[];
  logo?: React.ReactNode;
  logoLabel?: string;
  userProfile?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  navItems,
  logo,
  logoLabel = 'Money Manager',
  userProfile,
  onLogout,
}) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const toggleSubmenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed md:static left-0 top-0 h-screen z-40 w-64 bg-white dark:bg-slate-800',
          'border-r border-slate-200 dark:border-slate-700',
          'flex flex-col transition-transform duration-250 md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo area */}
        <div className="px-6 py-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            {logo && <div className="flex-shrink-0">{logo}</div>}
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                {logoLabel}
              </h1>
              <p className="text-xs text-[#F97316]">India</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.submenu ? (
                <button
                  onClick={() => toggleSubmenu(item.label)}
                  className={cn(
                    'w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg text-sm font-medium',
                    'text-slate-700 dark:text-slate-300',
                    'hover:bg-slate-100 dark:hover:bg-slate-700',
                    'transition-colors duration-200',
                    expandedMenu === item.label && 'bg-slate-100 dark:bg-slate-700'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>
                    {item.label}
                  </div>
                  <svg
                    className={cn(
                      'w-4 h-4 transition-transform duration-200',
                      expandedMenu === item.label && 'rotate-180'
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium',
                    'transition-colors duration-200',
                    isActive(item.href)
                      ? 'bg-[#F97316] text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>
                  {item.label}
                </Link>
              )}

              {/* Submenu */}
              {item.submenu && expandedMenu === item.label && (
                <div className="mt-1 ml-6 space-y-1 border-l-2 border-slate-200 dark:border-slate-700 pl-4">
                  {item.submenu.map((subitem) => (
                    <Link
                      key={subitem.label}
                      href={subitem.href}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
                        'transition-colors duration-200',
                        isActive(subitem.href)
                          ? 'bg-[#F97316]/10 text-[#F97316] font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="w-1 h-1 rounded-full bg-current" />
                      {subitem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User profile */}
        {userProfile && (
          <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <div className="flex items-center gap-3 px-2">
              {userProfile.avatar ? (
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#F97316] flex items-center justify-center text-white font-bold text-sm">
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                  {userProfile.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {userProfile.email}
                </p>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className={cn(
                  'w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                  'text-slate-700 dark:text-slate-300',
                  'hover:bg-slate-100 dark:hover:bg-slate-700',
                  'transition-colors duration-200'
                )}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            )}
          </div>
        )}
      </aside>

      {/* Mobile menu toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed md:hidden bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#F97316] text-white flex items-center justify-center shadow-lg"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>
    </>
  );
};

Sidebar.displayName = 'Sidebar';
