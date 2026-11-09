import { Role } from '../enums/role.enum'
import { MeetingStatus, MeetingType } from '../generated/prisma/client'

export interface MeetingCreateRequestDto {
  name: string
  type: MeetingType
  startAt: Date
  endAt: Date
  role: Role
  note?: string
}

export interface MeetingUpdateRequestDto {
  name: string
  type: MeetingType
  startAt: Date
  endAt: Date
  role: Role
  note?: string
  status: MeetingStatus
}

export interface MeetingListRequestDto {
  scope: string
  cursor?: string | undefined
}
