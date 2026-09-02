import { prisma } from '../lib/prisma.js';
import { BookingStatus, MechanicStatus, Prisma } from '@prisma/client';
import { ApiError, VALID_TRANSITIONS } from '../types/index.js';
import type { PaginatedResponse, BookingWithRelations } from '../types/index.js';

interface ListBookingsParams {
  page: number;
  limit: number;
  status?: BookingStatus;
  dateFrom?: Date;
  dateTo?: Date;
  mechanicId?: string;
  categoryId?: string;
  search?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export async function listBookings(params: ListBookingsParams): Promise<PaginatedResponse<BookingWithRelations>> {
  const { page, limit, status, dateFrom, dateTo, mechanicId, categoryId, search, sortBy, sortOrder } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.BookingWhereInput = {};

  if (status) where.status = status;
  if (mechanicId) where.mechanicId = mechanicId;
  if (categoryId) where.serviceCategoryId = categoryId;

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = dateFrom;
    if (dateTo) where.createdAt.lte = dateTo;
  }

  if (search) {
    where.OR = [
      { id: { contains: search, mode: 'insensitive' } },
      { customer: { name: { contains: search, mode: 'insensitive' } } },
      { vehiclePlate: { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderBy: Prisma.BookingOrderByWithRelationInput = { [sortBy]: sortOrder };

  const [data, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true } },
        mechanic: { select: { id: true, name: true, phone: true, status: true } },
        serviceCategory: { select: { id: true, name: true } },
      },
    }),
    prisma.booking.count({ where }),
  ]);

  return {
    data: data.map((b) => ({
      ...b,
      amount: Number(b.amount),
    })) as unknown as BookingWithRelations[],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getBookingById(id: string) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      customer: true,
      mechanic: true,
      serviceCategory: true,
    },
  });

  if (!booking) {
    throw new ApiError(404, 'Booking not found', 'NOT_FOUND');
  }

  return { ...booking, amount: Number(booking.amount) };
}

export async function updateBookingStatus(
  id: string,
  newStatus: BookingStatus,
  mechanicId?: string
) {
  const booking = await prisma.booking.findUnique({ where: { id } });

  if (!booking) {
    throw new ApiError(404, 'Booking not found', 'NOT_FOUND');
  }

  // Validate state transition
  const allowed = VALID_TRANSITIONS[booking.status];
  if (!allowed.includes(newStatus)) {
    throw new ApiError(
      400,
      `Cannot transition from ${booking.status} to ${newStatus}`,
      'INVALID_TRANSITION'
    );
  }

  // If transitioning to ASSIGNED, require a mechanicId
  if (newStatus === BookingStatus.ASSIGNED && !mechanicId && !booking.mechanicId) {
    throw new ApiError(400, 'mechanicId is required when assigning a booking', 'VALIDATION_ERROR');
  }

  const updateData: Prisma.BookingUpdateInput = {
    status: newStatus,
  };

  if (mechanicId) {
    updateData.mechanic = { connect: { id: mechanicId } };
  }

  if (newStatus === BookingStatus.COMPLETED) {
    updateData.completedAt = new Date();
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: updateData,
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      mechanic: { select: { id: true, name: true, phone: true, status: true } },
      serviceCategory: { select: { id: true, name: true } },
    },
  });

  // Update mechanic status based on booking state
  if (updated.mechanicId) {
    if (newStatus === BookingStatus.COMPLETED || newStatus === BookingStatus.CANCELLED) {
      await prisma.mechanic.update({
        where: { id: updated.mechanicId },
        data: {
          status: MechanicStatus.AVAILABLE,
          jobsCompleted: newStatus === BookingStatus.COMPLETED
            ? { increment: 1 }
            : undefined,
        },
      });
    } else if (
      newStatus === BookingStatus.ASSIGNED ||
      newStatus === BookingStatus.MECHANIC_ON_THE_WAY ||
      newStatus === BookingStatus.IN_PROGRESS
    ) {
      await prisma.mechanic.update({
        where: { id: updated.mechanicId },
        data: { status: MechanicStatus.ON_JOB },
      });
    }
  }

  return { ...updated, amount: Number(updated.amount) };
}
