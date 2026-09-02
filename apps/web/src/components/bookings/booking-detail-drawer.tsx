'use client';

import { X, User, Wrench, Car, Clock, IndianRupee } from 'lucide-react';
import type { Booking, BookingStatus } from '@/types';
import { StatusBadge } from './status-badge';
import { useUpdateBookingStatus } from '@/hooks/use-bookings';
import { cn } from '@/lib/utils';

// Valid next transitions for each status
const validTransitions: Record<BookingStatus, { status: BookingStatus; label: string }[]> = {
  PENDING: [
    { status: 'ASSIGNED', label: 'Assign Mechanic' },
    { status: 'CANCELLED', label: 'Cancel' },
  ],
  ASSIGNED: [
    { status: 'MECHANIC_ON_THE_WAY', label: 'Mechanic Dispatched' },
    { status: 'CANCELLED', label: 'Cancel' },
  ],
  MECHANIC_ON_THE_WAY: [
    { status: 'IN_PROGRESS', label: 'Start Service' },
    { status: 'CANCELLED', label: 'Cancel' },
  ],
  IN_PROGRESS: [
    { status: 'COMPLETED', label: 'Complete' },
    { status: 'CANCELLED', label: 'Cancel' },
  ],
  COMPLETED: [],
  CANCELLED: [],
};

interface BookingDetailDrawerProps {
  booking: Booking | null;
  onClose: () => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function BookingDetailDrawer({ booking, onClose }: BookingDetailDrawerProps) {
  const updateStatus = useUpdateBookingStatus();

  if (!booking) return null;

  const transitions = validTransitions[booking.status] || [];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border z-50 overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-border bg-card/95 backdrop-blur-sm">
          <div>
            <p className="text-xs text-muted-foreground font-mono">Booking</p>
            <p className="text-sm font-medium">{booking.id.slice(0, 12)}…</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <StatusBadge status={booking.status} />
          </div>

          {/* Amount */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <IndianRupee className="h-4 w-4" />
              Amount
            </span>
            <span className="text-lg font-bold">
              ₹{booking.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          </div>

          {/* Customer */}
          <div className="rounded-lg border border-border p-3 space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              Customer
            </h4>
            <p className="font-medium">{booking.customer.name}</p>
            <p className="text-sm text-muted-foreground">{booking.customer.email}</p>
            <p className="text-sm text-muted-foreground">{booking.customer.phone}</p>
          </div>

          {/* Mechanic */}
          {booking.mechanic && (
            <div className="rounded-lg border border-border p-3 space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5" />
                Mechanic
              </h4>
              <p className="font-medium">{booking.mechanic.name}</p>
              <p className="text-sm text-muted-foreground">{booking.mechanic.phone}</p>
            </div>
          )}

          {/* Vehicle */}
          <div className="rounded-lg border border-border p-3 space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Car className="h-3.5 w-3.5" />
              Vehicle
            </h4>
            <p className="font-medium">
              {booking.vehicleMake} {booking.vehicleModel}
            </p>
            <p className="text-sm text-muted-foreground font-mono">{booking.vehiclePlate}</p>
          </div>

          {/* Service */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Service</span>
            <span className="font-medium">{booking.serviceCategory.name}</span>
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Scheduled
              </span>
              <span className="text-sm">{formatDate(booking.scheduledAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Created</span>
              <span className="text-sm">{formatDate(booking.createdAt)}</span>
            </div>
            {booking.completedAt && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="text-sm">{formatDate(booking.completedAt)}</span>
              </div>
            )}
          </div>

          {/* Status Transition Buttons */}
          {transitions.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </p>
              <div className="flex flex-wrap gap-2">
                {transitions.map((t) => (
                  <button
                    key={t.status}
                    onClick={() => {
                      updateStatus.mutate({
                        id: booking.id,
                        status: t.status,
                      });
                    }}
                    disabled={updateStatus.isPending}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50',
                      t.status === 'CANCELLED'
                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
