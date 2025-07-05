import { Request, Response, NextFunction, RequestHandler } from 'express';
import { campgroundSchema } from '../schemas/campgroundSchema';

export function validateCampground(req: Request, res: Response, next: NextFunction) {
  const result = campgroundSchema.safeParse(req.body);
  if (!result.success) {
    const erros = result.error.errors.map(err => err.message).join(', ');
    res.status(400).send(`Erro na validação: ${erros}`);
    return;
  }
  next();
}
