'use client';

import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cn } from '@/lib/cn';

interface SelectProps {
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  options: Array<{ value: string; label: string }>;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      label,
      placeholder = 'Select an option...',
      error,
      helperText,
      required = false,
      disabled = false,
      options,
      value,
      onValueChange,
    },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-label text-slate-700 dark:text-slate-300 font-medium">
            {label}
            {required && <span className="text-[#F43F5E] ml-1">*</span>}
          </label>
        )}

        <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectPrimitive.Trigger
            ref={ref}
            className={cn(
              'inline-flex items-center justify-between w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-700',
              'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50',
              'placeholder:text-slate-400 dark:placeholder:text-slate-500',
              'transition-all duration-250',
              'focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20',
              'dark:focus:border-[#F97316] dark:focus:ring-[#F97316]/20',
              'disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed',
              error && 'border-[#F43F5E] focus:border-[#F43F5E] focus:ring-[#F43F5E]/20'
            )}
          >
            <SelectPrimitive.Value placeholder={placeholder} />
            <SelectPrimitive.Icon className="w-4 h-4 opacity-50">
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
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg"
              position="popper"
            >
              <SelectPrimitive.ScrollUpButton className="flex items-center justify-center h-6 text-slate-700 dark:text-slate-300" />

              <SelectPrimitive.Viewport>
                {options.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    className={cn(
                      'relative flex items-center px-4 py-2 text-base cursor-pointer select-none',
                      'text-slate-900 dark:text-slate-50',
                      'focus:bg-[#F97316]/10 dark:focus:bg-[#F97316]/20 outline-none',
                      'data-[state=checked]:bg-[#F97316]/20 dark:data-[state=checked]:bg-[#F97316]/30'
                    )}
                  >
                    <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                    <SelectPrimitive.ItemIndicator className="ml-auto">
                      <svg
                        className="w-4 h-4 text-[#F97316]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>

              <SelectPrimitive.ScrollDownButton className="flex items-center justify-center h-6 text-slate-700 dark:text-slate-300" />
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>

        {error && (
          <p className="text-body-sm text-[#F43F5E] dark:text-[#FF6B7D]" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-body-sm text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
