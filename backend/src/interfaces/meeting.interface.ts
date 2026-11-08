import { MeetingStatus, MeetingType } from '../generated/prisma/client'

export interface CreateMeetingWithCandidateInput {
  name: string
  type: MeetingType
  status: MeetingStatus
  startAt: Date
  endAt: Date
  role: string
  note?: string
}

export interface UpdateMeetingWithCandidateInput {
  name: string
  type: MeetingType
  status: MeetingStatus
  startAt: Date
  endAt: Date
  role: string
  note?: string
}

export interface MeetingsParams {
  statuses?: MeetingStatus[]
  endBefore?: Date
  endAfter?: Date
  candidateId?: number
}
