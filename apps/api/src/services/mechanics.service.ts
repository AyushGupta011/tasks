import { prisma } from '../lib/prisma.js';
import { MechanicStatus } from '@prisma/client';
import { ApiError } from '../types/index.js';

export async function listMechanics(status?: MechanicStatus) {
  const where = status ? { status } : {};

  const mechanics = await prisma.mechanic.findMany({
    where,
    orderBy: { jobsCompleted: 'desc' },
    include: {
      bookings: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          serviceCategory: { select: { name: true } },
          customer: { select: { name: true } },
        },
      },
    },
  });

  return mechanics.map((m) => ({
    ...m,
    lastBooking: m.bookings[0]
      ? {
          id: m.bookings[0].id,
          status: m.bookings[0].status,
          service: m.bookings[0].serviceCategory.name,
          customer: m.bookings[0].customer.name,
          createdAt: m.bookings[0].createdAt,
        }
      : null,
    bookings: undefined,
  }));
}

export async function getMechanicById(id: string) {
  const mechanic = await prisma.mechanic.findUnique({
    where: { id },
    include: {
      bookings: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          serviceCategory: { select: { name: true } },
          customer: { select: { name: true } },
        },
      },
    },
  });

  if (!mechanic) {
    throw new ApiError(404, 'Mechanic not found', 'NOT_FOUND');
  }

  return mechanic;
}
