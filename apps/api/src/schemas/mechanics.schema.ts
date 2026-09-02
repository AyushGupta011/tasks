import { z } from 'zod';

export const listMechanicsSchema = {
  query: z.object({
    status: z.enum(['AVAILABLE', 'ON_JOB', 'OFFLINE']).optional(),
  }),
};

export const getMechanicSchema = {
  params: z.object({
    id: z.string().min(1),
  }),
};
