import React from 'react';
import { cn } from '@/lib/cn';
import { Card, CardContent } from './card';

interface StatCardProps {
  label: string;
  value: number;
  currency?: 'INR';
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning';
  onClick?: () => void;
  className?: string;
}

const variantStyles = {
  default: 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700',
  success: 'bg-[#10B981]/5 dark:bg-[#10B981]/10 border-[#10B981]/20 dark:border-[#10B981]/30',
  danger: 'bg-[#F43F5E]/5 dark:bg-[#F43F5E]/10 border-[#F43F5E]/20 dark:border-[#F43F5E]/30',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700/30',
};

const iconWrapperStyles = {
  default: 'bg-slate-200 dark:bg-slate-700',
  success: 'bg-[#10B981]/20 dark:bg-[#10B981]/30',
  danger: 'bg-[#F43F5E]/20 dark:bg-[#F43F5E]/30',
  warning: 'bg-yellow-200 dark:bg-yellow-900/40',
};

const iconColorStyles = {
  default: 'text-slate-600 dark:text-slate-400',
  success: 'text-[#047857] dark:text-[#6EE7B7]',
  danger: 'text-[#BE123C] dark:text-[#FF6B7D]',
  warning: 'text-yellow-700 dark:text-yellow-300',
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  currency = 'INR',
  trend,
  trendValue,
  trendLabel,
  icon,
  variant = 'default',
  onClick,
  className,
}) => {
  const formattedValue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);

  const trendColor =
    trend === 'up'
      ? 'text-[#10B981]'
      : trend === 'down'
        ? 'text-[#F43F5E]'
        : 'text-slate-500';

  const trendBgColor =
    trend === 'up'
      ? 'bg-[#10B981]/10'
      : trend === 'down'
        ? 'bg-[#F43F5E]/10'
        : 'bg-slate-100 dark:bg-slate-800';

  return (
    <Card
      className={cn(
        'border-2 transition-all duration-250',
        variantStyles[variant],
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
      onClick={onClick}
      hoverable={Boolean(onClick)}
    >
      <CardContent className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 truncate">
            {label}
          </p>

          <div className="flex items-baseline gap-2 flex-wrap">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {formattedValue}
            </h3>

            {trend && trendValue !== undefined && (
              <div className={cn('flex items-center gap-1 px-2 py-1 rounded', trendBgColor)}>
                {trend === 'up' ? (
                  <svg className={cn('w-4 h-4', trendColor)} fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414-1.414L13.586 7H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className={cn('w-4 h-4', trendColor)} fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1V9a1 1 0 112 0v3.586l4.293-4.293a1 1 0 011.414 1.414L8.414 13H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span className={cn('text-xs font-semibold', trendColor)}>
                  {trendValue}%
                </span>
              </div>
            )}
          </div>

          {trendLabel && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {trendLabel}
            </p>
          )}
        </div>

        {icon && (
          <div className={cn(
            'flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center',
            iconWrapperStyles[variant],
            iconColorStyles[variant]
          )}>
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

StatCard.displayName = 'StatCard';
