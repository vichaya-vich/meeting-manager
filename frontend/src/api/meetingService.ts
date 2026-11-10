import { apiService } from '@/api/apiService'
import type { MeetingScopeKey } from '@/constants/meetingScope'
import type { MeetingResponseDto } from '@/interfaces/meetingResponse'

export const meetingService = {
  getMeetings: (params: { scope: MeetingScopeKey; cursor?: number | null }, signal?: AbortSignal) =>
    apiService
      .get<MeetingResponseDto[]>('/api/meetings', { params, signal })
      .then(async ({ data }) => data),
}
