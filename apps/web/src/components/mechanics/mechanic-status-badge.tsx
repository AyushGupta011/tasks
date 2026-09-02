import { cn } from '@/lib/utils';
import type { MechanicStatus } from '@/types';

const statusConfig: Record<MechanicStatus, { label: string; className: string }> = {
  AVAILABLE: {
    label: 'Available',
    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  ON_JOB: {
    label: 'On Job',
    className: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
  OFFLINE: {
    label: 'Offline',
    className: 'bg-muted text-muted-foreground border-border',
  },
};

interface MechanicStatusBadgeProps {
  status: MechanicStatus;
  className?: string;
}

export function MechanicStatusBadge({ status, className }: MechanicStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {status !== 'OFFLINE' && (
        <span className="relative flex h-2 w-2">
          {status === 'ON_JOB' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          )}
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {config.label}
    </span>
  );
}
