import React from 'react';
import { cn } from '@/lib/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  label,
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorStyles = {
    primary: 'text-[#F97316]',
    secondary: 'text-slate-600 dark:text-slate-400',
    white: 'text-white',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <svg
        className={cn('animate-spin', sizeStyles[size], colorStyles[color])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {label && <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>}
    </div>
  );
};

LoadingSpinner.displayName = 'LoadingSpinner';

interface SkeletonProps {
  className?: string;
  count?: number;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  count = 1,
  height = 'h-4',
}) => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'skeleton',
            height,
            'rounded',
            className
          )}
        />
      ))}
    </div>
  );
};

Skeleton.displayName = 'Skeleton';

interface SkeletonCardProps {
  showHeader?: boolean;
  showFooter?: boolean;
  lines?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  showHeader = true,
  showFooter = false,
  lines = 3,
}) => {
  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between gap-4">
          <Skeleton height="h-6" className="flex-1" />
          <Skeleton height="h-8 w-8" />
        </div>
      )}

      <div className="space-y-2">
        <Skeleton count={lines} height="h-4" />
        <Skeleton height="h-4 w-2/3" />
      </div>

      {showFooter && (
        <div className="flex items-center justify-end gap-2 pt-4">
          <Skeleton height="h-10 w-20" />
          <Skeleton height="h-10 w-24" />
        </div>
      )}
    </div>
  );
};

SkeletonCard.displayName = 'SkeletonCard';

interface LoadingPageProps {
  label?: string;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({
  label = 'Loading...',
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" label={label} />
    </div>
  );
};

LoadingPage.displayName = 'LoadingPage';
