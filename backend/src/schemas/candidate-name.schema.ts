import { z } from 'zod'

export const candidateNameSchema = z.object({
  query: z.object({
    name: z
      .string('name is required')
      .min(3, 'name must be at least 3 characters')
      .max(50, 'name must be at most 50 characters'),
  }),
})
