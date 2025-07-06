import { z } from 'zod';

export const reviewSchema = z.object({
  review: z.object({
    rating: z.preprocess(
      (val) => Number(val),
      z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').int('Rating must be an integer')
    ),
    body: z.string().min(1, 'Review body is required')
  })
});
