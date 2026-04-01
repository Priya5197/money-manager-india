'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatINR, formatPercent } from '@/utils/format';
import { cn } from '@/lib/cn';
import {
  AlertCircle,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

export interface InsightCardProps {
  type: 'warning' | 'tip' | 'achievement' | 'opportunity';
  title: string;
  description: string;
  amount?: number;
  suggestion: string;
  priority?: 'high' | 'medium' | 'low';
  metric?: {
    label: string;
    value: string | number;
    change?: number;
  };
}

const typeConfig = {
  warning: {
    icon: AlertCircle,
    color: 'bg-red-50 border-red-200',
    badgeVariant: 'destructive',
    accentColor: 'text-red-600',
    iconColor: 'text-red-600',
  },
  tip: {
    icon: Lightbulb,
    color: 'bg-blue-50 border-blue-200',
    badgeVariant: 'secondary',
    accentColor: 'text-blue-600',
    iconColor: 'text-blue-600',
  },
  achievement: {
    icon: CheckCircle,
    color: 'bg-green-50 border-green-200',
    badgeVariant: 'success',
    accentColor: 'text-green-600',
    iconColor: 'text-green-600',
  },
  opportunity: {
    icon: TrendingUp,
    color: 'bg-amber-50 border-amber-200',
    badgeVariant: 'outline',
    accentColor: 'text-amber-600',
    iconColor: 'text-amber-600',
  },
};

const priorityConfig = {
  high: { label: 'High Priority', color: 'bg-red-100 text-red-800' },
  medium: { label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' },
  low: { label: 'Low Priority', color: 'bg-gray-100 text-gray-800' },
};

export function InsightCard({
  type,
  title,
  description,
  amount,
  suggestion,
  priority,
  metric,
}: InsightCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Card
      className={cn(
        'border-2 p-4 transition-all hover:shadow-md',
        config.color
      )}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <div className={cn('mt-1 rounded-full p-2', config.color)}>
              <Icon className={cn('h-5 w-5', config.iconColor)} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{title}</h3>
              {priority && (
                <span
                  className={cn(
                    'mt-1 inline-block text-xs font-medium px-2 py-1 rounded',
                    priorityConfig[priority].color
                  )}
                >
                  {priorityConfig[priority].label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700">{description}</p>

        {/* Amount & Metric Display */}
        <div className="flex items-center justify-between">
          {amount !== undefined && (
            <div className={cn('text-lg font-bold', config.accentColor)}>
              {formatINR(amount)}
            </div>
          )}
          {metric && (
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500">{metric.label}</span>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-gray-900">
                  {metric.value}
                </span>
                {metric.change !== undefined && (
                  <span
                    className={cn(
                      'flex items-center gap-0.5 text-xs font-medium',
                      metric.change >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    )}
                  >
                    {metric.change >= 0 ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {formatPercent(Math.abs(metric.change))}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Box */}
        <div className="rounded bg-white/60 p-2.5">
          <p className="text-xs font-medium text-gray-600">
            <span className="font-semibold">Suggestion:</span> {suggestion}
          </p>
        </div>
      </div>
    </Card>
  );
}
