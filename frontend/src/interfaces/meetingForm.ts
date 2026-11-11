import type { MeetingStatusKey } from '@/constants/meetingStatus'
import type { MeetingTypeKey } from '@/constants/meetingType'
import type { RoleKey } from '@/constants/role'
import type { Dayjs } from 'dayjs'

export interface MeetingFormType {
  name: string
  role: RoleKey
  date: Dayjs
  start: Dayjs
  end: Dayjs
  type: MeetingTypeKey
  note?: string
}

export interface MeetingUpdateFormType extends MeetingFormType {
  id: number
  status: MeetingStatusKey
}
