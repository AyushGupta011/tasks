'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

const COLORS = ['#14b8a6', '#8b5cf6', '#f59e0b', '#3b82f6', '#ef4444', '#f97316', '#10b981'];

interface CategoryBreakdownChartProps {
  data: Array<{ category: string; count: number }>;
  loading?: boolean;
}

export function CategoryBreakdownChart({ data, loading }: CategoryBreakdownChartProps) {
  if (loading) {
    return <div className="h-80 bg-muted/50 rounded animate-pulse" />;
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, bottom: 5, left: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11 }}
            className="fill-muted-foreground"
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="category"
            tick={{ fontSize: 11 }}
            className="fill-muted-foreground"
            axisLine={false}
            tickLine={false}
            width={110}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number) => [value.toLocaleString('en-IN'), 'Bookings']}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} animationDuration={1000}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
