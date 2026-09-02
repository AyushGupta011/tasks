'use client';

import { Wrench } from 'lucide-react';
import type { Mechanic } from '@/types';
import { MechanicStatusBadge } from './mechanic-status-badge';

interface MechanicsTableProps {
  mechanics: Mechanic[];
  loading?: boolean;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function MechanicsTable({ mechanics, loading }: MechanicsTableProps) {
  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-4 w-16 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!mechanics || mechanics.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-12 text-center flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Wrench className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No mechanics found</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Mechanic</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Jobs Completed</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Last Active</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Joined</th>
            </tr>
          </thead>
          <tbody>
            {mechanics.map((mechanic) => (
              <tr
                key={mechanic.id}
                className="border-b border-border/50 hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div>
                    <span className="font-medium">{mechanic.name}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{mechanic.phone}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <MechanicStatusBadge status={mechanic.status} />
                </td>
                <td className="px-4 py-3 text-right font-medium tabular-nums">
                  {mechanic.jobsCompleted}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                  {mechanic.lastBooking ? (
                    <div>
                      <span className="block text-foreground mb-1">
                        {mechanic.lastBooking.service}
                      </span>
                      {formatDate(mechanic.lastBooking.createdAt)}
                    </div>
                  ) : (
                    <span className="italic">No jobs yet</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                  {formatDate(mechanic.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
