import { z } from 'zod';

export const campgroundSchema = z.object({
  campground: z.object({
    title: z.string().min(1, 'Title is required'),
    image: z.string().url('Must be a valid URL'),
    price: z.preprocess(
      (val) => Number(val),
      z.number()
        .nonnegative('Price cannot be negative')
        .int('Price must be a whole number')
    ),
    description: z.string().min(10, 'Description is too short'),
    location: z.string().min(1, 'Location is required')
  })
});
