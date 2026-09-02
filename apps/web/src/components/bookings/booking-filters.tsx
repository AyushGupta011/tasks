'use client';

import { useState, useCallback } from 'react';
import type { BookingStatus, BookingsQueryParams } from '@/types';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const statuses: Array<{ value: BookingStatus | ''; label: string }> = [
  { value: '', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'MECHANIC_ON_THE_WAY', label: 'On the Way' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

interface BookingFiltersProps {
  filters: BookingsQueryParams;
  onFiltersChange: (filters: BookingsQueryParams) => void;
}

export function BookingFilters({ filters, onFiltersChange }: BookingFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchSubmit = useCallback(() => {
    onFiltersChange({ ...filters, search: searchValue || undefined, page: 1 });
  }, [filters, onFiltersChange, searchValue]);

  const handleReset = useCallback(() => {
    setSearchValue('');
    onFiltersChange({ page: 1, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' });
  }, [onFiltersChange]);

  const hasActiveFilters = filters.status || filters.dateFrom || filters.dateTo || filters.search;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by customer, booking ID, or plate..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>

        {/* Status filter */}
        <select
          value={filters.status || ''}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              status: (e.target.value || undefined) as BookingStatus | undefined,
              page: 1,
            })
          }
          className="h-9 px-3 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
        >
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Toggle extra filters */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'h-9 px-3 rounded-lg border text-sm font-medium transition-colors flex items-center gap-1.5',
            showFilters
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-input bg-card text-muted-foreground hover:text-foreground'
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="h-9 px-3 rounded-lg border border-input bg-card text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <X className="h-4 w-4" />
            Reset
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground">From</label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  dateFrom: e.target.value || undefined,
                  page: 1,
                })
              }
              className="h-8 px-2 rounded-md border border-input bg-card text-xs focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground">To</label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  dateTo: e.target.value || undefined,
                  page: 1,
                })
              }
              className="h-8 px-2 rounded-md border border-input bg-card text-xs focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground">Sort by</label>
            <select
              value={filters.sortBy || 'createdAt'}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  sortBy: e.target.value as BookingsQueryParams['sortBy'],
                })
              }
              className="h-8 px-2 rounded-md border border-input bg-card text-xs focus:outline-none focus:ring-2 focus:ring-ring/50"
            >
              <option value="createdAt">Date Created</option>
              <option value="scheduledAt">Scheduled</option>
              <option value="amount">Amount</option>
              <option value="status">Status</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground">Order</label>
            <select
              value={filters.sortOrder || 'desc'}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  sortOrder: e.target.value as 'asc' | 'desc',
                })
              }
              className="h-8 px-2 rounded-md border border-input bg-card text-xs focus:outline-none focus:ring-2 focus:ring-ring/50"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
