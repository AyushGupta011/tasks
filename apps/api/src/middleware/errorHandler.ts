import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ApiError } from '../types/index.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('Error:', err.message);

  // Custom ApiError
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: { message: err.message, code: err.code },
    });
    return;
  }

  // Prisma: record not found
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      res.status(404).json({
        error: { message: 'Resource not found', code: 'NOT_FOUND' },
      });
      return;
    }
    if (err.code === 'P2002') {
      res.status(409).json({
        error: { message: 'Resource already exists', code: 'CONFLICT' },
      });
      return;
    }
  }

  // Fallback
  res.status(500).json({
    error: {
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
      code: 'INTERNAL_ERROR',
    },
  });
}
