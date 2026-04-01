'use client';

import React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from '@/lib/cn';

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string;
  helperText?: string;
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, helperText, id, ...props }, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <CheckboxPrimitive.Root
          ref={ref}
          id={checkboxId}
          className={cn(
            'peer h-5 w-5 shrink-0 rounded border-2 border-slate-300 dark:border-slate-600',
            'bg-white dark:bg-slate-800',
            'focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors duration-250',
            'data-[state=checked]:bg-[#F97316] data-[state=checked]:border-[#F97316]',
            className
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {label && (
          <label
            htmlFor={checkboxId}
            className={cn(
              'text-sm font-medium text-slate-700 dark:text-slate-300',
              'cursor-pointer transition-colors',
              'peer-disabled:cursor-not-allowed peer-disabled:opacity-50'
            )}
          >
            {label}
          </label>
        )}
      </div>

      {helperText && (
        <p className="text-xs text-slate-500 dark:text-slate-400 ml-8">
          {helperText}
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
