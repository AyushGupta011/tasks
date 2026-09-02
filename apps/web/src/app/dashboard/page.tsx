'use client';

import { useDashboard } from '@/hooks/use-dashboard';
import { useSocket } from '@/hooks/use-socket';
import { StatCard } from '@/components/dashboard/stat-card';
import { MiniChart } from '@/components/dashboard/mini-chart';
import {
  CalendarCheck,
  CalendarClock,
  IndianRupee,
  Wrench,
  Users,
  TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
  const { data: stats, isLoading, error } = useDashboard(30);
  useSocket(); // Connect socket for live updates

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive text-lg font-medium">Failed to load dashboard</p>
          <p className="text-muted-foreground mt-1">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings}
          icon={CalendarCheck}
          color="teal"
          loading={isLoading}
        />
        <StatCard
          title="Today's Bookings"
          value={stats?.todayBookings}
          icon={CalendarClock}
          color="violet"
          loading={isLoading}
        />
        <StatCard
          title="Total Revenue"
          value={stats?.totalRevenue}
          icon={IndianRupee}
          format="currency"
          color="emerald"
          loading={isLoading}
        />
        <StatCard
          title="Active Mechanics"
          value={stats?.activeMechanics}
          icon={Wrench}
          color="amber"
          loading={isLoading}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Completed"
          value={stats?.completedBookings}
          icon={TrendingUp}
          color="emerald"
          loading={isLoading}
          compact
        />
        <StatCard
          title="Pending"
          value={stats?.pendingBookings}
          icon={CalendarClock}
          color="amber"
          loading={isLoading}
          compact
        />
        <StatCard
          title="Cancelled"
          value={stats?.cancelledBookings}
          icon={CalendarCheck}
          color="red"
          loading={isLoading}
          compact
        />
        <StatCard
          title="New Customers (7d)"
          value={stats?.newCustomers}
          icon={Users}
          color="violet"
          loading={isLoading}
          compact
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MiniChart
          title="Bookings Over Time"
          data={stats?.bookingsOverTime || []}
          dataKey="count"
          xKey="date"
          color="#14b8a6"
          loading={isLoading}
          type="area"
        />
        <MiniChart
          title="Revenue Over Time"
          data={stats?.revenueOverTime || []}
          dataKey="revenue"
          xKey="date"
          color="#8b5cf6"
          loading={isLoading}
          type="line"
          format="currency"
        />
      </div>
    </div>
  );
}
