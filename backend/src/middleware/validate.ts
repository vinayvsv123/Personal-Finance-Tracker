import type { Request, Response, NextFunction } from 'express';
import { ZodError,type ZodSchema } from 'zod';

type RequestData = {
  body?: unknown;
  query?: unknown;
  params?: unknown;
};

export const validateRequest =
  (schema: ZodSchema<RequestData>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed.body) req.body = parsed.body as any;
      if (parsed.query) req.query = parsed.query as any;
      if (parsed.params) req.params = parsed.params as any;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          errors: error.issues,
        });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  };