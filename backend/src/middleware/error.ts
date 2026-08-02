import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: 'Endpoint not found.' });
}

// Express identifies error handlers by arity — `next` must stay in the signature.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.message });
  }

  console.error('[error]', err);

  res.status(500).json({
    error: 'Something went wrong. Please try again.',
    ...(env.isProd ? {} : { detail: (err as Error)?.message }),
  });
}

/** Wraps an async handler so rejected promises reach the error middleware. */
export function asyncHandler<T extends Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: T, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
