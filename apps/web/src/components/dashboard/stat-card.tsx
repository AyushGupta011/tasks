import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value?: number;
  icon: LucideIcon;
  color: 'teal' | 'violet' | 'emerald' | 'amber' | 'red' | 'blue';
  format?: 'number' | 'currency';
  loading?: boolean;
  compact?: boolean;
}

const colorMap = {
  teal: {
    border: 'from-teal-500 to-teal-600',
    bg: 'bg-teal-500/10',
    text: 'text-teal-500',
  },
  violet: {
    border: 'from-violet-500 to-violet-600',
    bg: 'bg-violet-500/10',
    text: 'text-violet-500',
  },
  emerald: {
    border: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-500',
  },
  amber: {
    border: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-500/10',
    text: 'text-amber-500',
  },
  red: {
    border: 'from-red-500 to-red-600',
    bg: 'bg-red-500/10',
    text: 'text-red-500',
  },
  blue: {
    border: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
  },
};

function formatValue(value: number, format: 'number' | 'currency' = 'number'): string {
  if (format === 'currency') {
    return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }
  return value.toLocaleString('en-IN');
}

export function StatCard({
  title,
  value,
  icon: Icon,
  color,
  format = 'number',
  loading,
  compact,
}: StatCardProps) {
  const colors = colorMap[color];

  if (loading) {
    return (
      <div className={cn('bg-card rounded-xl border border-border', compact ? 'p-4' : 'p-5')}>
        <div className="animate-pulse space-y-3">
          <div className="h-3 w-24 bg-muted rounded" />
          <div className="h-8 w-20 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative bg-card rounded-xl border border-border overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 group',
        compact ? 'p-4' : 'p-5'
      )}
    >
      {/* Gradient left border accent */}
      <div className={cn('absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b', colors.border)} />

      <div className="flex items-start justify-between ml-2">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <p className={cn('font-bold mt-1', compact ? 'text-xl' : 'text-2xl lg:text-3xl')}>
            {value !== undefined ? formatValue(value, format) : '—'}
          </p>
        </div>
        <div className={cn('p-2 rounded-lg', colors.bg)}>
          <Icon className={cn('shrink-0', colors.text, compact ? 'h-4 w-4' : 'h-5 w-5')} />
        </div>
      </div>
    </div>
  );
}
