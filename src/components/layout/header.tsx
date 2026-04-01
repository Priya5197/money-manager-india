'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/cn';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  userMenu?: {
    name: string;
    email: string;
    avatar?: string;
    onProfile?: () => void;
    onSettings?: () => void;
    onLogout?: () => void;
  };
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showSearch = true,
  onSearch,
  userMenu,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left side: Title */}
          <div className="flex-1 min-w-0">
            {title && (
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {/* Middle: Search */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-xs">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search..."
                  className={cn(
                    'w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700',
                    'bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-50',
                    'placeholder:text-slate-400 dark:placeholder:text-slate-500',
                    'focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20'
                  )}
                />
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Right side: User menu */}
          {userMenu && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  {userMenu.avatar ? (
                    <img
                      src={userMenu.avatar}
                      alt={userMenu.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#F97316] flex items-center justify-center text-white font-bold text-xs">
                      {userMenu.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="hidden sm:flex flex-col items-start gap-0">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                      {userMenu.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {userMenu.email}
                    </span>
                  </div>
                  <svg
                    className="w-4 h-4 text-slate-400 hidden sm:block"
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
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    {userMenu.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {userMenu.email}
                  </p>
                </div>

                {userMenu.onProfile && (
                  <DropdownMenuItem onClick={userMenu.onProfile}>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Profile
                  </DropdownMenuItem>
                )}

                {userMenu.onSettings && (
                  <DropdownMenuItem onClick={userMenu.onSettings}>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Settings
                  </DropdownMenuItem>
                )}

                {(userMenu.onProfile || userMenu.onSettings) && userMenu.onLogout && (
                  <DropdownMenuSeparator />
                )}

                {userMenu.onLogout && (
                  <DropdownMenuItem onClick={userMenu.onLogout}>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

Header.displayName = 'Header';
