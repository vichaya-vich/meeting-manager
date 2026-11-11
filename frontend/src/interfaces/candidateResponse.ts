import type { RoleKey } from '@/constants/role'
import type { MeetingResponseDto } from '@/interfaces/meetingResponse'

export interface CandidateResponseDto {
  id: number
  name: string
  role: RoleKey
  upcomings: MeetingResponseDto[]
  histories: MeetingResponseDto[]
}
