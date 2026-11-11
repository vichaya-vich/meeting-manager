import { apiService } from '@/api/apiService'
import type { MeetingScopeKey } from '@/constants/meetingScope'
import type { MeetingCreateRequestDto } from '@/interfaces/meetingRequest'
import type { MeetingResponseDto } from '@/interfaces/meetingResponse'

export const meetingService = {
  getMeetings: (params: { scope: MeetingScopeKey; cursor?: number | null }, signal?: AbortSignal) =>
    apiService
      .get<MeetingResponseDto[]>('/api/meetings', { params, signal })
      .then(async ({ data }) => data),

  createMeeting: (body: MeetingCreateRequestDto) =>
    apiService.post<MeetingResponseDto>('/api/meetings', body).then(async ({ data }) => data),

  cancelMeeting: (id: number) =>
    apiService.put(`/api/meetings/${id}/cancel`).then(async ({ data }) => data),

  feedback: (id: number, feedback: string) =>
    apiService.put(`/api/meetings/${id}/feedback`, { feedback }).then(async ({ data }) => data),
}
