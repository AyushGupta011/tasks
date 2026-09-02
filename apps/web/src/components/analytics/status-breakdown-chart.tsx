'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import type { BookingStatus } from '@/types';

const STATUS_COLORS: Record<BookingStatus, string> = {
  PENDING: '#f59e0b',
  ASSIGNED: '#3b82f6',
  MECHANIC_ON_THE_WAY: '#6366f1',
  IN_PROGRESS: '#f97316',
  COMPLETED: '#10b981',
  CANCELLED: '#ef4444',
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: 'Pending',
  ASSIGNED: 'Assigned',
  MECHANIC_ON_THE_WAY: 'On the Way',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

interface StatusBreakdownChartProps {
  data: Array<{ status: BookingStatus; count: number }>;
  loading?: boolean;
}

export function StatusBreakdownChart({ data, loading }: StatusBreakdownChartProps) {
  if (loading) {
    return <div className="h-80 bg-muted/50 rounded animate-pulse" />;
  }

  const total = data.reduce((sum, d) => sum + d.count, 0);

  const chartData = data.map((d) => ({
    name: STATUS_LABELS[d.status] || d.status,
    value: d.count,
    color: STATUS_COLORS[d.status] || '#94a3b8',
  }));

  return (
    <div className="h-80 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            animationDuration={1000}
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number, name: string) => [
              `${value} (${((value / total) * 100).toFixed(1)}%)`,
              name,
            ]}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: 'var(--foreground)', fontSize: '11px' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ marginBottom: '30px' }}>
        <div className="text-center">
          <p className="text-2xl font-bold">{total.toLocaleString('en-IN')}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
      </div>
    </div>
  );
}
