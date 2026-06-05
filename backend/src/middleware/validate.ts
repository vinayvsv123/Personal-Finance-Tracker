import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodTypeAny } from 'zod';

export const validateRequest =
  <T extends ZodTypeAny>(schema: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);

      // replace body with validated + typed data
      req.body = parsed;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((e) => e.message.trim()).join(', ');
        return res.status(400).json({ message, errors: error.issues });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  };