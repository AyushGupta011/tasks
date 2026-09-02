import { prisma } from '../lib/prisma.js';
import { BookingStatus } from '@prisma/client';
import type { DashboardStats } from '../types/index.js';

export async function getDashboardStats(days: number = 30): Promise<DashboardStats> {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const daysAgo = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Run all aggregate queries in parallel
  const [
    totalBookings,
    todayBookings,
    completedBookings,
    pendingBookings,
    cancelledBookings,
    revenueResult,
    activeMechanics,
    newCustomers,
    statusBreakdownRaw,
    categoryBreakdownRaw,
    bookingsOverTimeRaw,
    revenueOverTimeRaw,
  ] = await Promise.all([
    // Total bookings
    prisma.booking.count(),

    // Today's bookings
    prisma.booking.count({
      where: { createdAt: { gte: startOfToday } },
    }),

    // Completed bookings
    prisma.booking.count({
      where: { status: BookingStatus.COMPLETED },
    }),

    // Pending bookings
    prisma.booking.count({
      where: { status: BookingStatus.PENDING },
    }),

    // Cancelled bookings
    prisma.booking.count({
      where: { status: BookingStatus.CANCELLED },
    }),

    // Total revenue (from completed bookings)
    prisma.booking.aggregate({
      _sum: { amount: true },
      where: { status: BookingStatus.COMPLETED },
    }),

    // Active mechanics (AVAILABLE or ON_JOB)
    prisma.mechanic.count({
      where: { status: { in: ['AVAILABLE', 'ON_JOB'] } },
    }),

    // New customers (last 7 days)
    prisma.customer.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    }),

    // Status breakdown
    prisma.booking.groupBy({
      by: ['status'],
      _count: { id: true },
    }),

    // Category breakdown
    prisma.booking.groupBy({
      by: ['serviceCategoryId'],
      _count: { id: true },
    }),

    // Bookings over time (daily for last N days)
    prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
      SELECT DATE("createdAt") as date, COUNT(*)::bigint as count
      FROM bookings
      WHERE "createdAt" >= ${daysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `,

    // Revenue over time (daily for last N days)
    prisma.$queryRaw<Array<{ date: string; revenue: number }>>`
      SELECT DATE("createdAt") as date, COALESCE(SUM(amount), 0)::float as revenue
      FROM bookings
      WHERE "createdAt" >= ${daysAgo} AND status = 'COMPLETED'
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `,
  ]);

  // Fetch category names for the breakdown
  const categoryIds = categoryBreakdownRaw.map((c) => c.serviceCategoryId);
  const categories = await prisma.serviceCategory.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, name: true },
  });
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  return {
    totalBookings,
    todayBookings,
    completedBookings,
    pendingBookings,
    cancelledBookings,
    totalRevenue: Number(revenueResult._sum.amount ?? 0),
    activeMechanics,
    newCustomers,
    statusBreakdown: statusBreakdownRaw.map((s) => ({
      status: s.status,
      count: s._count.id,
    })),
    categoryBreakdown: categoryBreakdownRaw.map((c) => ({
      category: categoryMap.get(c.serviceCategoryId) || 'Unknown',
      count: c._count.id,
    })),
    bookingsOverTime: bookingsOverTimeRaw.map((b) => ({
      date: new Date(b.date).toISOString().split('T')[0]!,
      count: Number(b.count),
    })),
    revenueOverTime: revenueOverTimeRaw.map((r) => ({
      date: new Date(r.date).toISOString().split('T')[0]!,
      revenue: Number(r.revenue),
    })),
  };
}
