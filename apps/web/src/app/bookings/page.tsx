'use client';

import { useState, useCallback } from 'react';
import { useBookings } from '@/hooks/use-bookings';
import { useSocket } from '@/hooks/use-socket';
import { BookingFilters } from '@/components/bookings/booking-filters';
import { BookingsTable } from '@/components/bookings/bookings-table';
import { BookingDetailDrawer } from '@/components/bookings/booking-detail-drawer';
import type { Booking, BookingsQueryParams } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BookingsPage() {
  const [filters, setFilters] = useState<BookingsQueryParams>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { data, isLoading, error } = useBookings(filters);
  const { lastEvent } = useSocket();

  const handleFiltersChange = useCallback((newFilters: BookingsQueryParams) => {
    setFilters(newFilters);
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive text-lg font-medium">Failed to load bookings</p>
          <p className="text-muted-foreground mt-1">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  const pagination = data?.pagination;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <BookingFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Table */}
      <BookingsTable
        bookings={data?.data || []}
        loading={isLoading}
        onRowClick={(booking) => setSelectedBooking(booking)}
        lastUpdatedId={lastEvent?.id}
      />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1}–
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total.toLocaleString()}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))}
              disabled={pagination.page <= 1}
              className="h-8 w-8 rounded-lg border border-input bg-card flex items-center justify-center disabled:opacity-40 hover:bg-muted transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium px-2">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
              disabled={pagination.page >= pagination.totalPages}
              className="h-8 w-8 rounded-lg border border-input bg-card flex items-center justify-center disabled:opacity-40 hover:bg-muted transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      <BookingDetailDrawer
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
}
