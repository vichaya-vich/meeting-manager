import type { MeetingStatusKey } from '@/constants/meetingStatus'
import type { MeetingTypeKey } from '@/constants/meetingType'
import type { RoleKey } from '@/constants/role'

export interface MeetingResponseDto {
  id: number
  name: string
  candidateId: number
  type: MeetingTypeKey
  status: MeetingStatusKey
  startAt: Date
  endAt: Date
  role: RoleKey
  note?: string | null
  feedback?: string | null
  createdAt: Date
  updatedAt: Date
}
