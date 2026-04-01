import React from 'react';
import { cn } from '@/lib/cn';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  animated?: boolean;
  striped?: boolean;
  className?: string;
}

const variantColors = {
  default: 'bg-[#F97316]',
  success: 'bg-[#10B981]',
  warning: 'bg-yellow-500',
  danger: 'bg-[#F43F5E]',
};

const sizeStyles = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  variant = 'default',
  animated = true,
  striped = false,
  className,
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  // Determine variant based on percentage if not explicitly set
  let finalVariant = variant;
  if (variant === 'default') {
    if (percentage >= 80) finalVariant = 'danger';
    else if (percentage >= 60) finalVariant = 'warning';
    else finalVariant = 'success';
  }

  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}

      <div className={cn(
        'w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden',
        sizeStyles[size]
      )}>
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out rounded-full',
            variantColors[finalVariant],
            animated && 'animate-pulse',
            striped && 'bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';

interface SegmentedProgressBarProps {
  segments: Array<{
    value: number;
    variant?: 'success' | 'warning' | 'danger' | 'neutral';
    label?: string;
  }>;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

const segmentColors = {
  success: 'bg-[#10B981]',
  warning: 'bg-yellow-500',
  danger: 'bg-[#F43F5E]',
  neutral: 'bg-slate-300 dark:bg-slate-600',
};

export const SegmentedProgressBar: React.FC<SegmentedProgressBarProps> = ({
  segments,
  max = 100,
  size = 'md',
  showLabels = false,
  className,
}) => {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);

  return (
    <div className={className}>
      {showLabels && (
        <div className="flex flex-wrap gap-2 mb-3">
          {segments.map((seg, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={cn('w-3 h-3 rounded-full', segmentColors[seg.variant || 'neutral'])} />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {seg.label || seg.label} ({seg.value.toFixed(0)}%)
              </span>
            </div>
          ))}
        </div>
      )}

      <div className={cn(
        'w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex',
        sizeStyles[size]
      )}>
        {segments.map((segment, idx) => {
          const segmentPercentage = (segment.value / max) * 100;
          return (
            <div
              key={idx}
              className={cn(
                'transition-all duration-500',
                segmentColors[segment.variant || 'neutral']
              )}
              style={{
                width: `${segmentPercentage}%`,
                minWidth: segmentPercentage > 0 ? '1px' : '0',
              }}
              title={segment.label}
            />
          );
        })}
      </div>
    </div>
  );
};

SegmentedProgressBar.displayName = 'SegmentedProgressBar';
