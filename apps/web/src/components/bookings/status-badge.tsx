import { cn } from '@/lib/utils';
import type { BookingStatus } from '@/types';

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Pending',
    className: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
  ASSIGNED: {
    label: 'Assigned',
    className: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
  MECHANIC_ON_THE_WAY: {
    label: 'On the Way',
    className: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-red-500/10 text-red-500 border-red-500/20',
  },
};

// Active states that get a pulsing dot
const activeStatuses: BookingStatus[] = ['ASSIGNED', 'MECHANIC_ON_THE_WAY', 'IN_PROGRESS'];

interface StatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.PENDING;
  const isActive = activeStatuses.includes(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {isActive && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {config.label}
    </span>
  );
}
