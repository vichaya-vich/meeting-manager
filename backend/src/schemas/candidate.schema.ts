import { z } from 'zod'
import { Role } from '../enums/role.enum'

export const candidateSchema = z.object({
  params: z.object({ id: z.coerce.number('id is required').int().positive() }),
  query: z.object({
    role: z.enum(Role, 'invalid role'),
  }),
})
