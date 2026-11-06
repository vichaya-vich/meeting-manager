import { MeetingStatus, MeetingType } from '../generated/prisma/client'

export interface MeetingResponseDto {
  id: number
  name: string
  candidateId: number
  type: MeetingType
  status: MeetingStatus
  startAt: Date
  endAt: Date
  role: string
  note?: string | null
  createdAt: Date
  updatedAt: Date
}
