import { z } from 'zod'
import { Role } from '../enums/role.enum'
import { MeetingType } from '../generated/prisma/client'

export const meetingCreateSchema = z.object({
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
        .refine((date) => date.getTime() > Date.now(), {
          message: 'startAt must not be in the past',
        }),
      endAt: z.coerce.date('endAt must be a valid date'),
      role: z.enum(Role, 'invalid role'),
      note: z
        .string('note must be a string')
        .trim()
        .max(500, 'note must be at most 500 characters')
        .optional(),
    })
    .refine(({ endAt, startAt }) => endAt > startAt, {
      message: 'endAt must be after startAt',
      path: ['endAt'],
    }),
})
