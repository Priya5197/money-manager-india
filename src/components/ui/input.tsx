'use client';

import React from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      required = false,
      fullWidth = false,
      type = 'text',
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

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
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
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
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 text-slate-500 dark:text-slate-400 flex-shrink-0 pointer-events-none">
              {rightIcon}
            </div>
          )}
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

Input.displayName = 'Input';
