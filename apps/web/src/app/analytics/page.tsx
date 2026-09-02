'use client';

import { useState } from 'react';
import { useDashboard } from '@/hooks/use-dashboard';
import { BookingsOverTimeChart } from '@/components/analytics/bookings-over-time-chart';
import { RevenueOverTimeChart } from '@/components/analytics/revenue-over-time-chart';
import { StatusBreakdownChart } from '@/components/analytics/status-breakdown-chart';
import { CategoryBreakdownChart } from '@/components/analytics/category-breakdown-chart';
import { cn } from '@/lib/utils';

const timeRanges = [
  { label: '7d', value: 7 },
  { label: '14d', value: 14 },
  { label: '30d', value: 30 },
  { label: '60d', value: 60 },
  { label: '90d', value: 90 },
];

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const { data: stats, isLoading, error } = useDashboard(days);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive text-lg font-medium">Failed to load analytics</p>
          <p className="text-muted-foreground mt-1">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time range selector */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted w-fit">
        {timeRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => setDays(range.value)}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              days === range.value
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Over Time */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold mb-4">Bookings Over Time</h3>
          <BookingsOverTimeChart
            data={stats?.bookingsOverTime || []}
            loading={isLoading}
          />
        </div>

        {/* Revenue Over Time */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold mb-4">Revenue Over Time</h3>
          <RevenueOverTimeChart
            data={stats?.revenueOverTime || []}
            loading={isLoading}
          />
        </div>

        {/* Status Breakdown */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold mb-4">Status Breakdown</h3>
          <StatusBreakdownChart
            data={stats?.statusBreakdown || []}
            loading={isLoading}
          />
        </div>

        {/* Category Breakdown */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold mb-4">Category Breakdown</h3>
          <CategoryBreakdownChart
            data={stats?.categoryBreakdown || []}
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
