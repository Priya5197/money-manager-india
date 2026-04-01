import React from 'react';
import { cn } from '@/lib/cn';

interface AuthLayoutProps {
  children: React.ReactNode;
  logo?: React.ReactNode;
  logoLabel?: string;
  heading?: string;
  subheading?: string;
  footer?: React.ReactNode;
  backgroundPattern?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  logo,
  logoLabel = 'Money Manager',
  heading,
  subheading,
  footer,
  backgroundPattern = true,
}) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Background pattern */}
      {backgroundPattern && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#F97316]/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl" />
        </div>
      )}

      {/* Left side: Branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center px-8 py-12 relative z-10">
        <div className="text-center space-y-6 max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3">
            {logo && (
              <div className="w-12 h-12 rounded-lg bg-[#F97316] flex items-center justify-center text-white text-xl font-bold">
                {logo}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                {logoLabel}
              </h1>
              <p className="text-sm text-[#F97316] font-semibold">India</p>
            </div>
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Smart Money Management
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Track your finances, plan your budget, and achieve your financial goals with ease.
            </p>
          </div>

          {/* Features list */}
          <div className="space-y-3 pt-4">
            {[
              'Track income and expenses',
              'Smart budget planning',
              'Financial reports & insights',
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-slate-700 dark:text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side: Auth form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo (visible only on mobile) */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            {logo && (
              <div className="w-10 h-10 rounded-lg bg-[#F97316] flex items-center justify-center text-white font-bold text-sm">
                {logo}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                {logoLabel}
              </h1>
              <p className="text-xs text-[#F97316]">India</p>
            </div>
          </div>

          {/* Card content */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-lg">
            {/* Heading */}
            {heading && (
              <div className="space-y-2 mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                  {heading}
                </h2>
                {subheading && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {subheading}
                  </p>
                )}
              </div>
            )}

            {/* Children (form content) */}
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="text-center text-sm text-slate-600 dark:text-slate-400">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

AuthLayout.displayName = 'AuthLayout';
