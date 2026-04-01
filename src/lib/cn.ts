import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge classNames with Tailwind CSS class resolution
 * Combines clsx for conditional classes with tailwind-merge for proper override handling
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
