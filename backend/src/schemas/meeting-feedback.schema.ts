import { z } from 'zod'

export const meetingFeedbackSchema = z.object({
  params: z.object({ id: z.coerce.number('id is required').int().positive() }),
  body: z.object({
    feedback: z
      .string('feedback is required')
      .trim()
      .min(1, 'feedback must not be empty')
      .max(500, 'feedback must be at most 500 characters'),
  }),
})
