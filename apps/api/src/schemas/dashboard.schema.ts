import { z } from 'zod';

export const getDashboardSchema = {
  query: z.object({
    days: z.coerce.number().int().min(1).max(90).optional().default(30),
  }),
};
