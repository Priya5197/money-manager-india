'use client';

import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  PaginationState,
} from '@tanstack/react-table';
import { cn } from '@/lib/cn';
import { Button } from './button';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  sortable?: boolean;
  filterable?: boolean;
  paginated?: boolean;
  pageSize?: number;
  onExport?: () => void;
  emptyState?: React.ReactNode;
  striped?: boolean;
  hoverable?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  sortable = true,
  filterable = false,
  paginated = true,
  pageSize = 10,
  onExport,
  emptyState,
  striped = true,
  hoverable = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: sortable ? setSorting : undefined,
    getSortedRowModel: sortable ? getSortedRowModel() : undefined,
    onColumnFiltersChange: filterable ? setColumnFilters : undefined,
    getFilteredRowModel: filterable ? getFilteredRowModel() : undefined,
    onPaginationChange: paginated ? setPagination : undefined,
    getPaginationRowModel: paginated ? getPaginationRowModel() : undefined,
    state: {
      sorting: sortable ? sorting : undefined,
      columnFilters: filterable ? columnFilters : undefined,
      pagination: paginated ? pagination : undefined,
    },
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      {onExport && (
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 0l-4 2m4-2l4 2"
                />
              </svg>
            }
          >
            Export
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left font-semibold text-slate-900 dark:text-slate-50"
                    >
                      {sortable && header.column.getCanSort() ? (
                        <button
                          onClick={() => header.column.toggleSorting()}
                          className="flex items-center gap-2 hover:text-[#F97316] transition-colors"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getIsSorted() && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              {header.column.getIsSorted() === 'asc' ? (
                                <path
                                  fillRule="evenodd"
                                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"
                                  clipRule="evenodd"
                                />
                              ) : (
                                <path
                                  fillRule="evenodd"
                                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"
                                  clipRule="evenodd"
                                />
                              )}
                            </svg>
                          )}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {rows.length > 0 ? (
                rows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={cn(
                      'border-b border-slate-200 dark:border-slate-700 transition-colors',
                      striped && idx % 2 === 0 && 'bg-slate-50/50 dark:bg-slate-800/30',
                      hoverable && 'hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-slate-900 dark:text-slate-50">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    {emptyState || (
                      <div className="text-slate-500 dark:text-slate-400">
                        No data available
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {paginated && (
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Page {pagination.pageIndex + 1} of {Math.ceil(data.length / pageSize) || 1}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
