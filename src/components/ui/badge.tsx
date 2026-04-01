import React from 'react';
import { cn } from '@/lib/cn';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-50',
  success: 'bg-[#10B981]/10 dark:bg-[#10B981]/20 text-[#047857] dark:text-[#6EE7B7]',
  warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  danger: 'bg-[#F43F5E]/10 dark:bg-[#F43F5E]/20 text-[#BE123C] dark:text-[#FF6B7D]',
  info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  secondary: 'bg-[#F97316]/10 dark:bg-[#F97316]/20 text-[#C2410C] dark:text-[#FFEDD5]',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2.5 py-1 text-xs font-medium rounded',
  md: 'px-3 py-1.5 text-sm font-semibold rounded-md',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    icon,
    removable = false,
    onRemove,
    children,
    ...props
  }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2 font-medium transition-colors duration-250',
          'whitespace-nowrap',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
        {removable && (
          <button
            onClick={onRemove}
            className="ml-1 flex-shrink-0 inline-flex items-center justify-center w-4 h-4 rounded hover:opacity-70 transition-opacity"
            aria-label="Remove badge"
          >
            <svg
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
