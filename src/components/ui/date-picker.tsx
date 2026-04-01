'use client';

import React from 'react';
import { cn } from '@/lib/cn';

interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      required = false,
      fullWidth = false,
      leftIcon,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `datepicker-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('flex flex-col gap-2', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-label text-slate-700 dark:text-slate-300 font-medium"
          >
            {label}
            {required && <span className="text-[#F43F5E] ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-500 dark:text-slate-400 flex-shrink-0 pointer-events-none">
              {leftIcon || (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              )}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type="date"
            disabled={disabled}
            className={cn(
              'w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-700',
              'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50',
              'placeholder:text-slate-400 dark:placeholder:text-slate-500',
              'transition-all duration-250',
              'focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20',
              'dark:focus:border-[#F97316] dark:focus:ring-[#F97316]/20',
              'disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed',
              error && 'border-[#F43F5E] focus:border-[#F43F5E] focus:ring-[#F43F5E]/20 dark:focus:ring-[#F43F5E]/20',
              leftIcon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p className="text-body-sm text-[#F43F5E] dark:text-[#FF6B7D]" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-body-sm text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

interface DateRangePickerProps {
  label?: string;
  startDate?: string;
  endDate?: string;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
}

export const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      label,
      startDate,
      endDate,
      onStartDateChange,
      onEndDateChange,
      error,
      required = false,
      fullWidth = false,
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('flex flex-col gap-2', fullWidth && 'w-full')}>
        {label && (
          <label className="text-label text-slate-700 dark:text-slate-300 font-medium">
            {label}
            {required && <span className="text-[#F43F5E] ml-1">*</span>}
          </label>
        )}

        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="date"
              value={startDate || ''}
              onChange={(e) => onStartDateChange?.(e.target.value)}
              className={cn(
                'w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-700',
                'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50',
                'focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20',
                error && 'border-[#F43F5E]'
              )}
              placeholder="Start date"
            />
          </div>

          <div className="flex items-center justify-center text-slate-500 dark:text-slate-400">
            →
          </div>

          <div className="flex-1">
            <input
              type="date"
              value={endDate || ''}
              onChange={(e) => onEndDateChange?.(e.target.value)}
              className={cn(
                'w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-700',
                'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50',
                'focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20',
                error && 'border-[#F43F5E]'
              )}
              placeholder="End date"
            />
          </div>
        </div>

        {error && (
          <p className="text-body-sm text-[#F43F5E] dark:text-[#FF6B7D]" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

DateRangePicker.displayName = 'DateRangePicker';
