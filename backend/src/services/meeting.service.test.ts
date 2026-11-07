import { afterEach, beforeEach, describe, expect, Mock, test, vi } from 'vitest'
import { MeetingCreateRequestDto } from '../dto/meeting-request.dto'
import { Role } from '../enums/role.enum'
import { MeetingStatus, MeetingType } from '../generated/prisma/client'
import { MeetingRepository } from '../repositories/meeting.repository'
import { MeetingService } from '../services/meeting.service'

describe('MeetingService', () => {
  let meetingRepository: { createWithCandidate: Mock }
  let service: MeetingService

  beforeEach(() => {
    meetingRepository = { createWithCandidate: vi.fn() }
    service = new MeetingService(meetingRepository as unknown as MeetingRepository)
  })

  afterEach(() => vi.clearAllMocks())

  describe('createMeeting', () => {
    const date = new Date()
    const request: MeetingCreateRequestDto = {
      name: 'name',
      type: MeetingType.OFFLINE,
      startAt: date,
      endAt: date,
      role: Role.BACKEND,
      note: 'note',
    }
    const meeting = {
      id: 1,
      note: 'note',
      type: MeetingType.OFFLINE,
      status: MeetingStatus.PENDING,
      startAt: date,
      endAt: date,
      role: Role.BACKEND,
      createdAt: date,
      updatedAt: date,
      candidate: { name: 'name', id: 3 },
    }

    test('should create new meeting and return created data', async () => {
      meetingRepository.createWithCandidate.mockResolvedValue(meeting)

      const result = await service.createMeeting(request)

      expect(meetingRepository.createWithCandidate).toHaveBeenCalledWith({
        ...request,
        status: MeetingStatus.PENDING,
      })
      expect(result).toEqual({
        id: meeting.id,
        name: 'name',
        candidateId: 3,
        type: meeting.type,
        status: meeting.status,
        startAt: meeting.startAt,
        endAt: meeting.endAt,
        role: meeting.role,
        note: meeting.note,
        createdAt: meeting.createdAt,
        updatedAt: meeting.updatedAt,
      })
    })
  })
})
