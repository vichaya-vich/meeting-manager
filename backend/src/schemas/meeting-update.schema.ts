import { z } from 'zod'
import { Role } from '../enums/role.enum'
import { MeetingStatus, MeetingType } from '../generated/prisma/client'
import { truncateToMinute } from '../utils/date.util'

export const meetingUpdateSchema = z.object({
  params: z.object({ id: z.coerce.number('id is required').int().positive() }),
  body: z
    .object({
      name: z
        .string('name is required')
        .trim()
        .min(1, 'name must not be empty')
        .max(50, 'name must be at most 50 characters'),
      type: z.enum(MeetingType, 'invalid meeting type'),
      startAt: z.coerce
        .date('startAt must be a valid date')
        .transform(truncateToMinute)
        .refine((date) => date.getTime() >= truncateToMinute(new Date()).getTime(), {
          message: 'startAt must not be in the past',
        }),
      endAt: z.coerce.date('endAt must be a valid date').transform(truncateToMinute),
      role: z.enum(Role, 'invalid role'),
      note: z
        .string('note must be a string')
        .trim()
        .max(500, 'note must be at most 500 characters')
        .optional(),
      status: z.enum(MeetingStatus, 'invalid status'),
    })
    .refine(({ endAt, startAt }) => endAt > startAt, {
      message: 'endAt must be after startAt',
      path: ['endAt'],
    }),
})
