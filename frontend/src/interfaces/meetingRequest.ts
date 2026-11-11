import type { MeetingTypeKey } from '@/constants/meetingType'
import type { RoleKey } from '@/constants/role'

export interface MeetingCreateRequestDto {
  name: string
  type: MeetingTypeKey
  startAt: Date
  endAt: Date
  role: RoleKey
  note?: string
}
