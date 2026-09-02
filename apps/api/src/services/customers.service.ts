import { prisma } from '../lib/prisma.js';
import type { PaginatedResponse } from '../types/index.js';
import { Prisma } from '@prisma/client';

interface ListCustomersParams {
  page: number;
  limit: number;
  search?: string;
}

export async function listCustomers(params: ListCustomersParams): Promise<PaginatedResponse<any>> {
  const { page, limit, search } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.CustomerWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { bookings: true } },
      },
    }),
    prisma.customer.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
