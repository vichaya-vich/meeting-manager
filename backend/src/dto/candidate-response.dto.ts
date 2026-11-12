import { Role } from '../enums/role.enum'
import { MeetingResponseDto } from './meeting-response.dto'

export interface CandidateResponseDto {
  id: number
  name: string
  role: Role
  upcomings: MeetingResponseDto[]
  histories: MeetingResponseDto[]
}
