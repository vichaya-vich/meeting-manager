import { afterEach, beforeEach, describe, expect, Mock, test, vi } from 'vitest'
import { MeetingCreateRequestDto, MeetingUpdateRequestDto } from '../dto/meeting-request.dto'
import { Role } from '../enums/role.enum'
import { MeetingStatus, MeetingType } from '../generated/prisma/client'
import { ApplicationError } from '../handlers/error.handler'
import { MeetingRepository } from '../repositories/meeting.repository'
import { MeetingService } from '../services/meeting.service'

describe('MeetingService', () => {
  let meetingRepository: {
    findById: Mock
    createWithCandidate: Mock
    updateWithCandidate: Mock
  }
  let service: MeetingService

  beforeEach(() => {
    meetingRepository = {
      findById: vi.fn(),
      createWithCandidate: vi.fn(),
      updateWithCandidate: vi.fn(),
    }
    service = new MeetingService(meetingRepository as unknown as MeetingRepository)
    vi.useFakeTimers().setSystemTime(new Date('2026-11-08T10:00:00+07:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

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

  describe('updateMeeting', () => {
    const date = new Date()
    const request: MeetingUpdateRequestDto = {
      name: 'name',
      type: MeetingType.OFFLINE,
      startAt: new Date('2026-11-08T12:00:00+07:00'),
      endAt: new Date('2026-11-08T15:00:00+07:00'),
      role: Role.BACKEND,
      note: 'note',
      status: MeetingStatus.CONFIRM,
    }
    const meeting = {
      id: 1,
      note: 'note',
      type: MeetingType.OFFLINE,
      status: MeetingStatus.PENDING,
      startAt: new Date('2026-11-08T12:00:00+07:00'),
      endAt: new Date('2026-11-08T15:00:00+07:00'),
      role: Role.BACKEND,
      createdAt: date,
      updatedAt: date,
      candidate: { name: 'name', id: 3 },
    }

    test('should update existing meeting and return updated data', async () => {
      meetingRepository.findById.mockResolvedValue(meeting)
      meetingRepository.updateWithCandidate.mockResolvedValue(meeting)

      const result = await service.updateMeeting(1, request)

      expect(meetingRepository.findById).toHaveBeenCalledWith(1)
      expect(meetingRepository.updateWithCandidate).toHaveBeenCalledWith(1, request)
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

    test('should throw error when existing meeting is not found', async () => {
      meetingRepository.findById.mockResolvedValue(undefined)

      await expect(service.updateMeeting(1, request)).rejects.toThrow(
        new ApplicationError('Meeting Not Found'),
      )
      expect(meetingRepository.findById).toHaveBeenCalledWith(1)
      expect(meetingRepository.updateWithCandidate).not.toHaveBeenCalled()
    })

    test('should throw error when existing meeting status is CANCELED', async () => {
      meetingRepository.findById.mockResolvedValue({ ...meeting, status: MeetingStatus.CANCELED })

      await expect(service.updateMeeting(1, request)).rejects.toThrow(
        new ApplicationError('Not Allow to Update This Meeting'),
      )
      expect(meetingRepository.findById).toHaveBeenCalledWith(1)
      expect(meetingRepository.updateWithCandidate).not.toHaveBeenCalled()
    })

    test('should throw error when existing meeting is ended', async () => {
      meetingRepository.findById.mockResolvedValue({
        ...meeting,
        endAt: new Date('2026-11-08T09:00:00+07:00'),
      })

      await expect(service.updateMeeting(1, request)).rejects.toThrow(
        new ApplicationError('Not Allow to Update This Meeting'),
      )
      expect(meetingRepository.findById).toHaveBeenCalledWith(1)
      expect(meetingRepository.updateWithCandidate).not.toHaveBeenCalled()
    })
  })
})
