'use client';

import { useState } from 'react';
import { useMechanics } from '@/hooks/use-mechanics';
import { useSocket } from '@/hooks/use-socket';
import { MechanicsTable } from '@/components/mechanics/mechanics-table';
import type { MechanicStatus } from '@/types';
import { cn } from '@/lib/utils';
import { StatCard } from '@/components/dashboard/stat-card';
import { Wrench, CheckCircle2, Navigation } from 'lucide-react';

const filters: Array<{ label: string; value: MechanicStatus | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Available', value: 'AVAILABLE' },
  { label: 'On Job', value: 'ON_JOB' },
  { label: 'Offline', value: 'OFFLINE' },
];

export default function MechanicsPage() {
  const [filter, setFilter] = useState<MechanicStatus | 'ALL'>('ALL');
  const { data: mechanics, isLoading, error } = useMechanics(filter === 'ALL' ? undefined : filter);
  
  // Real-time updates for mechanic status (when bookings get updated)
  useSocket();

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive text-lg font-medium">Failed to load mechanics</p>
          <p className="text-muted-foreground mt-1">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  // Calculate summary stats locally if showing ALL
  const allMechanics = filter === 'ALL' ? mechanics : undefined;
  const availableCount = allMechanics?.filter((m) => m.status === 'AVAILABLE').length || 0;
  const onJobCount = allMechanics?.filter((m) => m.status === 'ON_JOB').length || 0;
  const totalCompleted = allMechanics?.reduce((sum, m) => sum + m.jobsCompleted, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      {filter === 'ALL' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Mechanics"
            value={allMechanics?.length}
            icon={Wrench}
            color="violet"
            loading={isLoading}
            compact
          />
          <StatCard
            title="Available Right Now"
            value={availableCount}
            icon={CheckCircle2}
            color="emerald"
            loading={isLoading}
            compact
          />
          <StatCard
            title="Currently On Job"
            value={onJobCount}
            icon={Navigation}
            color="blue"
            loading={isLoading}
            compact
          />
        </div>
      )}

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border',
              filter === f.value
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-card text-muted-foreground border-border hover:border-input hover:text-foreground'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <MechanicsTable mechanics={mechanics || []} loading={isLoading} />
    </div>
  );
}
