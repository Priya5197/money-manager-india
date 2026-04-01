'use client';

import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { cn } from '@/lib/cn';

interface ChartDataPoint {
  name: string;
  value: number;
}

interface PieChartProps {
  data: ChartDataPoint[];
  title?: string;
  description?: string;
  height?: number;
  colors?: string[];
  showLegend?: boolean;
  showTooltip?: boolean;
  donut?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  className?: string;
}

const defaultColors = ['#F97316', '#10B981', '#F43F5E', '#3B82F6', '#8B5CF6', '#EC4899'];

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
  if (!active || !payload) return null;

  const entry = payload[0];
  const value = entry.value as number;
  const name = entry.name;
  const percent = (
    ((value as number) /
      payload.reduce((sum, entry) => sum + (entry.value as number), 0)) *
    100
  ).toFixed(1);

  return (
    <div className="bg-slate-900 dark:bg-slate-950 text-white px-3 py-2 rounded-lg shadow-lg border border-slate-700 text-sm">
      <p className="font-semibold">{name}</p>
      <p>
        {value.toLocaleString()} ({percent}%)
      </p>
    </div>
  );
};

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  description,
  height = 300,
  colors = defaultColors,
  showLegend = true,
  showTooltip = true,
  donut = false,
  innerRadius = donut ? 60 : 0,
  outerRadius = 100,
  className,
}) => {
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
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey="value"
              isAnimationActive
            >
              {data.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={colors[idx % colors.length]}
                />
              ))}
            </Pie>

            {showTooltip && <Tooltip content={<CustomTooltip />} />}

            {showLegend && (
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry) => (
                  <span className="text-slate-700 dark:text-slate-300 text-sm">
                    {value}
                  </span>
                )}
              />
            )}
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

PieChart.displayName = 'PieChart';
