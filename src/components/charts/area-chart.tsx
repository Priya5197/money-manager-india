'use client';

import React from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { cn } from '@/lib/cn';

interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

interface AreaChartProps {
  data: ChartDataPoint[];
  dataKey: string | string[];
  title?: string;
  description?: string;
  height?: number;
  colors?: string[];
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
  xAxisKey?: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  smooth?: boolean;
  stacked?: boolean;
}

const defaultColors = ['#F97316', '#10B981', '#F43F5E', '#3B82F6'];

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-slate-900 dark:bg-slate-950 text-white px-3 py-2 rounded-lg shadow-lg border border-slate-700 text-sm">
      <p className="font-semibold">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
        </p>
      ))}
    </div>
  );
};

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  dataKey,
  title,
  description,
  height = 300,
  colors = defaultColors,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  className,
  xAxisKey = 'name',
  yAxisLabel,
  xAxisLabel,
  smooth = true,
  stacked = false,
}) => {
  const dataKeys = Array.isArray(dataKey) ? dataKey : [dataKey];

  return (
    <div className={cn('w-full space-y-3', className)}>
      {title && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="w-full h-full rounded-lg bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700">
        <ResponsiveContainer width="100%" height={height}>
          <RechartsAreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(203, 213, 225, 0.2)"
              />
            )}

            <XAxis
              dataKey={xAxisKey}
              stroke="rgba(100, 116, 139, 0.5)"
              tick={{ fill: 'rgba(100, 116, 139, 0.8)', fontSize: 12 }}
              label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottomRight', offset: -5 } : undefined}
            />

            <YAxis
              stroke="rgba(100, 116, 139, 0.5)"
              tick={{ fill: 'rgba(100, 116, 139, 0.8)', fontSize: 12 }}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
            />

            {showTooltip && <Tooltip content={<CustomTooltip />} />}

            {showLegend && <Legend />}

            {dataKeys.map((key, idx) => (
              <Area
                key={key}
                type={smooth ? 'monotone' : 'linear'}
                dataKey={key}
                stroke={colors[idx % colors.length]}
                fill={colors[idx % colors.length]}
                fillOpacity={0.2}
                stackId={stacked ? 'stack' : undefined}
                isAnimationActive
              />
            ))}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

AreaChart.displayName = 'AreaChart';
