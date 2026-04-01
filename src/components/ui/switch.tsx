'use client';

import React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '@/lib/cn';

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?: string;
  helperText?: string;
}

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, label, helperText, id, ...props }, ref) => {
  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <SwitchPrimitive.Root
          ref={ref}
          id={switchId}
          className={cn(
            'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full',
            'border-2 border-transparent bg-slate-300 dark:bg-slate-600',
            'transition-colors duration-250',
            'focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'data-[state=checked]:bg-[#F97316] dark:data-[state=checked]:bg-[#F97316]',
            className
          )}
          {...props}
        >
          <SwitchPrimitive.Thumb
            className={cn(
              'pointer-events-none block h-5 w-5 rounded-full bg-white dark:bg-slate-100 shadow-lg',
              'transition-transform duration-250',
              'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
            )}
          />
        </SwitchPrimitive.Root>

        {label && (
          <label
            htmlFor={switchId}
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
        <p className="text-xs text-slate-500 dark:text-slate-400 ml-14">
          {helperText}
        </p>
      )}
    </div>
  );
});

Switch.displayName = 'Switch';
