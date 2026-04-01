'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/cn';

export interface ReportFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  categories?: Array<{ id: string; name: string }>;
  accounts?: Array<{ id: string; name: string }>;
}

export interface FilterState {
  dateRange: {
    preset: 'thisMonth' | 'lastMonth' | 'last3Months' | 'last6Months' | 'thisYear' | 'custom' | null;
    startDate: string | null;
    endDate: string | null;
  };
  selectedCategories: string[];
  selectedAccounts: string[];
}

const DATE_PRESETS = [
  { id: 'thisMonth', label: 'This Month' },
  { id: 'lastMonth', label: 'Last Month' },
  { id: 'last3Months', label: 'Last 3 Months' },
  { id: 'last6Months', label: 'Last 6 Months' },
  { id: 'thisYear', label: 'This Year' },
  { id: 'custom', label: 'Custom' },
];

export function ReportFilters({
  onFiltersChange,
  categories = [],
  accounts = [],
}: ReportFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      preset: 'thisMonth',
      startDate: null,
      endDate: null,
    },
    selectedCategories: [],
    selectedAccounts: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    date: true,
    categories: false,
    accounts: false,
  });

  const handleDatePresetChange = (presetId: string) => {
    const newFilters = {
      ...filters,
      dateRange: {
        ...filters.dateRange,
        preset: presetId as FilterState['dateRange']['preset'],
        startDate: null,
        endDate: null,
      },
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCustomDateChange = (
    type: 'startDate' | 'endDate',
    value: string | null
  ) => {
    const newFilters = {
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [type]: value,
      },
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.selectedCategories.includes(categoryId)
      ? filters.selectedCategories.filter((id) => id !== categoryId)
      : [...filters.selectedCategories, categoryId];

    const newFilters = {
      ...filters,
      selectedCategories: newCategories,
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleAccountToggle = (accountId: string) => {
    const newAccounts = filters.selectedAccounts.includes(accountId)
      ? filters.selectedAccounts.filter((id) => id !== accountId)
      : [...filters.selectedAccounts, accountId];

    const newFilters = {
      ...filters,
      selectedAccounts: newAccounts,
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const newFilters: FilterState = {
      dateRange: {
        preset: 'thisMonth',
        startDate: null,
        endDate: null,
      },
      selectedCategories: [],
      selectedAccounts: [],
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        {/* Date Range Section */}
        <div className="space-y-3">
          <button
            onClick={() =>
              setExpandedSections((prev) => ({ ...prev, date: !prev.date }))
            }
            className="flex w-full items-center justify-between font-semibold text-gray-900"
          >
            <span>Date Range</span>
            <span className="text-sm">{expandedSections.date ? '▼' : '▶'}</span>
          </button>

          {expandedSections.date && (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                {DATE_PRESETS.map((preset) => (
                  <Button
                    key={preset.id}
                    variant={
                      filters.dateRange.preset === preset.id
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() => handleDatePresetChange(preset.id)}
                    className="w-full text-xs"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>

              {filters.dateRange.preset === 'custom' && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <DatePicker
                    label="Start Date"
                    value={filters.dateRange.startDate || ''}
                    onChange={(value) => handleCustomDateChange('startDate', value)}
                  />
                  <DatePicker
                    label="End Date"
                    value={filters.dateRange.endDate || ''}
                    onChange={(value) => handleCustomDateChange('endDate', value)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Categories Section */}
      {categories.length > 0 && (
        <Card className="p-4">
          <button
            onClick={() =>
              setExpandedSections((prev) => ({
                ...prev,
                categories: !prev.categories,
              }))
            }
            className="flex w-full items-center justify-between font-semibold text-gray-900"
          >
            <span>Categories</span>
            <span className="text-sm">
              {expandedSections.categories ? '▼' : '▶'}
              {filters.selectedCategories.length > 0 && (
                <span className="ml-2 text-xs font-normal text-blue-600">
                  ({filters.selectedCategories.length} selected)
                </span>
              )}
            </span>
          </button>

          {expandedSections.categories && (
            <div className="space-y-2 pt-3">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex cursor-pointer items-center space-x-2 rounded p-2 hover:bg-gray-100"
                >
                  <Checkbox
                    checked={filters.selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Accounts Section */}
      {accounts.length > 0 && (
        <Card className="p-4">
          <button
            onClick={() =>
              setExpandedSections((prev) => ({
                ...prev,
                accounts: !prev.accounts,
              }))
            }
            className="flex w-full items-center justify-between font-semibold text-gray-900"
          >
            <span>Accounts</span>
            <span className="text-sm">
              {expandedSections.accounts ? '▼' : '▶'}
              {filters.selectedAccounts.length > 0 && (
                <span className="ml-2 text-xs font-normal text-blue-600">
                  ({filters.selectedAccounts.length} selected)
                </span>
              )}
            </span>
          </button>

          {expandedSections.accounts && (
            <div className="space-y-2 pt-3">
              {accounts.map((account) => (
                <label
                  key={account.id}
                  className="flex cursor-pointer items-center space-x-2 rounded p-2 hover:bg-gray-100"
                >
                  <Checkbox
                    checked={filters.selectedAccounts.includes(account.id)}
                    onChange={() => handleAccountToggle(account.id)}
                  />
                  <span className="text-sm text-gray-700">{account.name}</span>
                </label>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={handleReset} variant="outline" className="flex-1">
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
