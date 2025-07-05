import { z } from 'zod';

export const campgroundSchema = z.object({
  campground: z.object({
    title: z.string().min(1, 'Título obrigatório'),
    image: z.string().url('Deve ser uma URL válida'),
    price: z.preprocess(
      (val) => Number(val),
      z.number()
        .nonnegative('Preço não pode ser negativo')
        .int('Preço deve ser um número inteiro')
    ),
    description: z.string().min(10, 'Descrição muito curta'),
    location: z.string().min(1, 'Localização obrigatória')
  })
});
