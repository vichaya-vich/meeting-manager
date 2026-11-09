import { Role } from '../enums/role.enum'
import { MeetingStatus, MeetingType } from '../generated/prisma/client'
import { MeetingResponseDto } from './meeting-response.dto'

export interface CandidateResponseDto {
  id: number
  name: string
  role: Role
  upcomings: MeetingResponseDto[]
  histories: MeetingResponseDto[]
}
