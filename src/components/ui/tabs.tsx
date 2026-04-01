'use client';

import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/cn';

interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {}

export const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    className={cn('w-full', className)}
    {...props}
  />
));

Tabs.displayName = 'Tabs';

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {}

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex items-center justify-start gap-1 rounded-lg bg-slate-100 dark:bg-slate-900 p-1',
      'border border-slate-200 dark:border-slate-700',
      className
    )}
    {...props}
  />
));

TabsList.displayName = 'TabsList';

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {}

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold',
      'text-slate-700 dark:text-slate-300',
      'transition-all duration-250',
      'focus:outline-none focus:ring-2 focus:ring-[#F97316]/20',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-[#F97316] data-[state=active]:shadow-sm',
      'hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-50 dark:hover:bg-slate-800/50',
      className
    )}
    {...props}
  />
));

TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {}

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 w-full animate-fade-in',
      'focus:outline-none focus:ring-2 focus:ring-[#F97316]/20',
      className
    )}
    {...props}
  />
));

TabsContent.displayName = 'TabsContent';
