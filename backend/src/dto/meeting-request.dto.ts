import { Role } from '../enums/role.enum'
import { MeetingType } from '../generated/prisma/client'

export interface MeetingCreateRequestDto {
  name: string
  type: MeetingType
  startAt: Date
  endAt: Date
  role: Role
  note?: string
}
