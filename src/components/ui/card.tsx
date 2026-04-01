import React from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  variant?: 'default' | 'glass';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, variant = 'default', ...props }, ref) => {
    const baseStyles =
      variant === 'glass'
        ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-700'
        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700';

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl shadow-sm transition-all duration-250',
          baseStyles,
          hoverable && 'hover:shadow-md dark:hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer',
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, description, action, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-b border-slate-200 dark:border-slate-700', className)}
      {...props}
    >
      {title || description ? (
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {title && <h3 className="text-h4 text-slate-900 dark:text-slate-50">{title}</h3>}
            {description && (
              <p className="text-body-sm text-slate-600 dark:text-slate-400 mt-1">{description}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      ) : (
        children
      )}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, noPadding = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(!noPadding && 'px-6 py-4', className)}
      {...props}
    />
  )
);

CardContent.displayName = 'CardContent';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, divider = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'px-6 py-4',
        divider && 'border-t border-slate-200 dark:border-slate-700',
        'flex items-center justify-end gap-3',
        className
      )}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';
