import { z } from 'zod';
import { BookingStatus } from '@prisma/client';

export const listBookingsSchema = {
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    status: z.nativeEnum(BookingStatus).optional(),
    dateFrom: z.coerce.date().optional(),
    dateTo: z.coerce.date().optional(),
    mechanicId: z.string().optional(),
    categoryId: z.string().optional(),
    search: z.string().optional(),
    sortBy: z.enum(['createdAt', 'amount', 'status', 'scheduledAt']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
};

export const getBookingSchema = {
  params: z.object({
    id: z.string().min(1),
  }),
};

export const updateBookingStatusSchema = {
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    status: z.nativeEnum(BookingStatus),
    mechanicId: z.string().optional(),
  }),
};
