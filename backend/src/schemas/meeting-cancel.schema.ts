import { z } from 'zod'

export const meetingCancelSchema = z.object({
  params: z.object({ id: z.coerce.number('id is required').int().positive() }),
})
