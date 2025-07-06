import { Request, Response, NextFunction, RequestHandler } from 'express';
import { campgroundSchema } from '../schemas/campgroundSchema';
import ExpressError from '../utils/expressError';

export function validateCampground(req: Request, res: Response, next: NextFunction) {
  const result = campgroundSchema.safeParse(req.body);
  if (!result.success) {
    const erros = result.error.errors.map(err => err.message).join(', ');
    throw new ExpressError(`Validation Error Dev: ${erros}`, 400);
  }
  next();
}