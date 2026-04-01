import React from 'react';
import { cn } from '@/lib/cn';
import { Button } from './button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  actionIcon,
  onAction,
  className,
  size = 'md',
}) => {
  const sizeStyles = {
    sm: 'py-8',
    md: 'py-16',
    lg: 'py-24',
  };

  const iconSizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 text-center',
        sizeStyles[size],
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            'text-slate-400 dark:text-slate-500',
            iconSizes[size]
          )}
        >
          {icon}
        </div>
      )}

      <div className="max-w-sm">
        <h3 className={cn('font-semibold text-slate-900 dark:text-slate-50', titleSizes[size])}>
          {title}
        </h3>

        {description && (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <Button
            variant="primary"
            size={size === 'lg' ? 'md' : 'sm'}
            onClick={onAction}
            leftIcon={actionIcon}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
