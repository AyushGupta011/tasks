'use client';

import type { Booking } from '@/types';
import { StatusBadge } from './status-badge';
import { cn } from '@/lib/utils';

interface BookingsTableProps {
  bookings: Booking[];
  loading?: boolean;
  onRowClick: (booking: Booking) => void;
  lastUpdatedId?: string | null;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatAmount(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function BookingsTable({ bookings, loading, onRowClick, lastUpdatedId }: BookingsTableProps) {
  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-4 w-28 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-4 w-16 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-4 w-16 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <p className="text-muted-foreground">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">ID</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Customer</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Service</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Vehicle</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                onClick={() => onRowClick(booking)}
                className={cn(
                  'border-b border-border/50 hover:bg-muted/50 cursor-pointer transition-colors',
                  booking.id === lastUpdatedId && 'animate-pulse-row'
                )}
              >
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {booking.id.slice(0, 8)}…
                </td>
                <td className="px-4 py-3">
                  <div>
                    <span className="font-medium">{booking.customer.name}</span>
                    <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                      {booking.customer.email}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                  {booking.serviceCategory.name}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs text-muted-foreground">
                    {booking.vehicleMake} {booking.vehicleModel}
                  </span>
                  <p className="text-xs text-muted-foreground/60 font-mono">
                    {booking.vehiclePlate}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="px-4 py-3 text-right font-medium tabular-nums">
                  {formatAmount(booking.amount)}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">
                  {formatDate(booking.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
