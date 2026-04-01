'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/cn';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeButton?: boolean;
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
  closeButton = true,
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 animate-fade-in" />

        {/* Content */}
        <Dialog.Content
          className={cn(
            'fixed z-50 left-[50%] top-[50%] w-full mx-auto translate-x-[-50%] translate-y-[-50%]',
            sizeStyles[size],
            'animate-slide-in-bottom',
            'rounded-xl bg-white dark:bg-slate-800',
            'border border-slate-200 dark:border-slate-700',
            'shadow-lg',
            'p-6',
            'focus:outline-none'
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {title && (
                <Dialog.Title className="text-h4 text-slate-900 dark:text-slate-50">
                  {title}
                </Dialog.Title>
              )}
              {description && (
                <Dialog.Description className="text-body-sm text-slate-600 dark:text-slate-400 mt-1">
                  {description}
                </Dialog.Description>
              )}
            </div>

            {closeButton && (
              <Dialog.Close className="ml-4 flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="sr-only">Close</span>
              </Dialog.Close>
            )}
          </div>

          {/* Body */}
          <div>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

Modal.displayName = 'Modal';

interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mb-6', className)}
      {...props}
    />
  )
);

ModalBody.displayName = 'ModalBody';

interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700', className)}
      {...props}
    />
  )
);

ModalFooter.displayName = 'ModalFooter';
