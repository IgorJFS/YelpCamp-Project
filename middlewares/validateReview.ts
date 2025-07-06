import { Request, Response, NextFunction } from 'express';
import { reviewSchema } from '../schemas/reviewSchema';
import ExpressError from '../utils/expressError';

export function validateReview(req: Request, res: Response, next: NextFunction) {
  const result = reviewSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(err => err.message).join(', ');
    throw new ExpressError(`Validation Error: ${errors}`, 400);
  }
  next();
}
