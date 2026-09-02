import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function validateRequest(schemas: ValidationSchemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: Array<{ location: string; path: string; message: string }> = [];

    for (const [location, schema] of Object.entries(schemas)) {
      if (!schema) continue;

      const target = location === 'body' ? req.body
        : location === 'query' ? req.query
        : req.params;

      try {
        const parsed = schema.parse(target);
        // Replace original with parsed (coerced) values
        if (location === 'body') req.body = parsed;
        else if (location === 'query') (req as any).query = parsed;
        else (req as any).params = parsed;
      } catch (err) {
        if (err instanceof ZodError) {
          errors.push(
            ...err.issues.map((issue) => ({
              location,
              path: issue.path.join('.'),
              message: issue.message,
            }))
          );
        }
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors,
        },
      });
      return;
    }

    next();
  };
}
