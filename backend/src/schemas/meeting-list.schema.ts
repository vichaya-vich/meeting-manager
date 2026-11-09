import { z } from 'zod'
import { MeetingScope } from '../enums/meeting-scope.enum'

export const meetingListSchema = z.object({
  query: z.object({
    scope: z.enum(MeetingScope, 'invalid scope'),
    cursor: z.coerce.number('cursor must be a positive integer').int().positive().optional(),
  }),
})
