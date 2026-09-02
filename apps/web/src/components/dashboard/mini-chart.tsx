'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface MiniChartProps {
  title: string;
  data: Array<Record<string, unknown>>;
  dataKey: string;
  xKey: string;
  color: string;
  loading?: boolean;
  type?: 'area' | 'line';
  format?: 'number' | 'currency';
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function formatTooltipValue(value: number, format: 'number' | 'currency' = 'number'): string {
  if (format === 'currency') {
    return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }
  return value.toLocaleString('en-IN');
}

export function MiniChart({
  title,
  data,
  dataKey,
  xKey,
  color,
  loading,
  type = 'area',
  format = 'number',
}: MiniChartProps) {
  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="h-4 w-40 bg-muted rounded mb-4 animate-pulse" />
        <div className="h-64 bg-muted/50 rounded animate-pulse" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey={xKey}
                tickFormatter={formatDate}
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
                axisLine={false}
                tickLine={false}
                width={45}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelFormatter={formatDate}
                formatter={(value: number) => [formatTooltipValue(value, format), title]}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                fill={`url(#gradient-${dataKey})`}
                animationDuration={1000}
              />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey={xKey}
                tickFormatter={formatDate}
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
                axisLine={false}
                tickLine={false}
                width={55}
                tickFormatter={(v) => (format === 'currency' ? `₹${(v / 1000).toFixed(0)}k` : v)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelFormatter={formatDate}
                formatter={(value: number) => [formatTooltipValue(value, format), title]}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, r: 3 }}
                activeDot={{ fill: color, r: 5 }}
                animationDuration={1000}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
