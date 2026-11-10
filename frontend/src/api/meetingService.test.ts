import { apiService } from '@/api/apiService'
import { meetingService } from '@/api/meetingService'
import { afterEach, describe, expect, test, vi } from 'vitest'

vi.mock('@/api/apiService', () => ({
  apiService: { get: vi.fn() },
}))

describe('MeetingService', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getMeetings', () => {
    const meeting = { id: 1, name: 'name' }

    test('should call api and response list of meeting', async () => {
      vi.mocked(apiService.get).mockResolvedValue({ data: [meeting] })
      const signal = new AbortController().signal
      const params = { scope: 'UPCOMING' as const, cursor: 1 }

      const result = await meetingService.getMeetings(params, signal)

      expect(apiService.get).toHaveBeenCalledWith('/api/meetings', { params, signal })
      expect(result).toEqual([meeting])
    })

    test('should error when api fails', async () => {
      vi.mocked(apiService.get).mockRejectedValue(new Error('error'))

      await expect(meetingService.getMeetings({ scope: 'UPCOMING' })).rejects.toThrow('error')
    })
  })
})
