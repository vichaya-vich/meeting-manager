import { afterEach, beforeEach, describe, expect, Mock, test, vi } from 'vitest'
import {
  MeetingCreateRequestDto,
  MeetingListRequestDto,
  MeetingUpdateRequestDto,
} from '../dto/meeting-request.dto'
import { MeetingScope } from '../enums/meeting-scope.enum'
import { Role } from '../enums/role.enum'
import { MeetingStatus, MeetingType } from '../generated/prisma/client'
import { ApplicationError } from '../handlers/error.handler'
import { MeetingRepository } from '../repositories/meeting.repository'
import { MeetingService } from '../services/meeting.service'

describe('MeetingService', () => {
  let meetingRepository: {
    findById: Mock
    findByIdWithCandidate: Mock
    findManyWithCandidate: Mock
    createWithCandidate: Mock
    updateWithCandidate: Mock
    update: Mock
  }
  let service: MeetingService

  beforeEach(() => {
    meetingRepository = {
      findById: vi.fn(),
      findByIdWithCandidate: vi.fn(),
      findManyWithCandidate: vi.fn(),
      createWithCandidate: vi.fn(),
      updateWithCandidate: vi.fn(),
      update: vi.fn(),
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

  describe('cancelMeeting', () => {
    const date = new Date()
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

    test('should cancel meeting', async () => {
      meetingRepository.findById.mockResolvedValue(meeting)
      meetingRepository.update.mockResolvedValue(meeting)

      const result = await service.cancelMeeting(1)

      expect(meetingRepository.findById).toHaveBeenCalledWith(1)
      expect(meetingRepository.update).toHaveBeenCalledWith(1, { status: MeetingStatus.CANCELED })
      expect(result).toEqual({
        id: meeting.id,
        updatedAt: meeting.updatedAt,
      })
    })

    test('should throw error when existing meeting is not found', async () => {
      meetingRepository.findById.mockResolvedValue(undefined)

      await expect(service.cancelMeeting(1)).rejects.toThrow(
        new ApplicationError('Meeting Not Found'),
      )
      expect(meetingRepository.findById).toHaveBeenCalledWith(1)
      expect(meetingRepository.update).not.toHaveBeenCalled()
    })

    test('should throw error when existing meeting status is CANCELED', async () => {
      meetingRepository.findById.mockResolvedValue({ ...meeting, status: MeetingStatus.CANCELED })

      await expect(service.cancelMeeting(1)).rejects.toThrow(
        new ApplicationError('Not Allow to Cancel This Meeting'),
      )
      expect(meetingRepository.findById).toHaveBeenCalledWith(1)
      expect(meetingRepository.update).not.toHaveBeenCalled()
    })

    test('should throw error when existing meeting is ended', async () => {
      meetingRepository.findById.mockResolvedValue({
        ...meeting,
        endAt: new Date('2026-11-08T09:00:00+07:00'),
      })

      await expect(service.cancelMeeting(1)).rejects.toThrow(
        new ApplicationError('Not Allow to Cancel This Meeting'),
      )
      expect(meetingRepository.findById).toHaveBeenCalledWith(1)
      expect(meetingRepository.update).not.toHaveBeenCalled()
    })
  })

  describe('feedback', () => {
    const feedback = 'feedback'
    const date = new Date()
    const meeting = {
      id: 1,
      note: 'note',
      type: MeetingType.OFFLINE,
      status: MeetingStatus.PENDING,
      startAt: new Date('2026-11-07T12:00:00+07:00'),
      endAt: new Date('2026-11-07T15:00:00+07:00'),
      role: Role.BACKEND,
      createdAt: date,
      updatedAt: date,
      candidate: { name: 'name', id: 3 },
    }

    test('should update existing meeting', async () => {
      meetingRepository.findById.mockResolvedValue(meeting)
      meetingRepository.update.mockResolvedValue(meeting)

      const result = await service.feedback(1, feedback)

      expect(meetingRepository.findById).toHaveBeenCalledWith(1)
      expect(meetingRepository.update).toHaveBeenCalledWith(1, { feedback })
      expect(result).toEqual({
        id: meeting.id,
        updatedAt: meeting.updatedAt,
      })
    })

    test('should throw error when existing meeting is not found', async () => {
      meetingRepository.findById.mockResolvedValue(undefined)

      await expect(service.feedback(1, feedback)).rejects.toThrow(
        new ApplicationError('Meeting Not Found'),
      )
      expect(meetingRepository.findById).toHaveBeenCalledWith(1)
      expect(meetingRepository.update).not.toHaveBeenCalled()
    })

    test('should throw error when existing meeting status is CANCELED', async () => {
      meetingRepository.findById.mockResolvedValue({ ...meeting, status: MeetingStatus.CANCELED })

      await expect(service.feedback(1, feedback)).rejects.toThrow(
        new ApplicationError('Not Allow to Add Feedback'),
      )
      expect(meetingRepository.findById).toHaveBeenCalledWith(1)
      expect(meetingRepository.update).not.toHaveBeenCalled()
    })

    test('should throw error when existing meeting is not ended', async () => {
      meetingRepository.findById.mockResolvedValue({
        ...meeting,
        endAt: new Date('2026-11-08T17:00:00+07:00'),
      })

      await expect(service.feedback(1, feedback)).rejects.toThrow(
        new ApplicationError('Not Allow to Add Feedback'),
      )
      expect(meetingRepository.findById).toHaveBeenCalledWith(1)
      expect(meetingRepository.update).not.toHaveBeenCalled()
    })
  })

  describe('findMeetings', () => {
    const date = new Date('2026-11-08T10:00:00+07:00')
    const request: MeetingListRequestDto = {
      scope: MeetingScope.UPCOMING,
      cursor: '1',
    }
    const statuses = [MeetingStatus.PENDING, MeetingStatus.CONFIRM]
    const meeting = {
      id: 1,
      note: 'note',
      feedback: 'feedback',
      type: MeetingType.OFFLINE,
      status: MeetingStatus.PENDING,
      startAt: new Date('2026-11-07T12:00:00+07:00'),
      endAt: new Date('2026-11-07T15:00:00+07:00'),
      role: Role.BACKEND,
      createdAt: date,
      updatedAt: date,
      candidate: { name: 'name', id: 3 },
    }
    const expected = {
      id: meeting.id,
      name: 'name',
      candidateId: 3,
      type: meeting.type,
      status: meeting.status,
      startAt: meeting.startAt,
      endAt: meeting.endAt,
      role: meeting.role,
      note: meeting.note,
      feedback: meeting.feedback,
      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
    }

    test('should return upcoming meeting when scope is upcoming', async () => {
      meetingRepository.findManyWithCandidate.mockResolvedValue([meeting])

      const result = await service.findMeetings(request)

      expect(result.length).toBe(1)
      expect(result[0]).toEqual(expected)
      expect(meetingRepository.findManyWithCandidate).toHaveBeenCalledWith(
        { statuses, endAfter: date },
        { endAt: 'asc' },
        1,
        10,
      )
    })

    test('should return upcoming meeting when scope is finished', async () => {
      meetingRepository.findManyWithCandidate.mockResolvedValue([meeting])

      const result = await service.findMeetings({ ...request, scope: MeetingScope.FINISHED })

      expect(result.length).toBe(1)
      expect(result[0]).toEqual(expected)
      expect(meetingRepository.findManyWithCandidate).toHaveBeenCalledWith(
        { statuses, endBefore: date },
        { endAt: 'desc' },
        1,
        10,
      )
    })

    test('should return upcoming meeting when cursor is undefined', async () => {
      meetingRepository.findManyWithCandidate.mockResolvedValue([meeting])

      const result = await service.findMeetings({ scope: MeetingScope.UPCOMING })

      expect(result.length).toBe(1)
      expect(result[0]).toEqual(expected)
      expect(meetingRepository.findManyWithCandidate).toHaveBeenCalledWith(
        { statuses, endAfter: date },
        { endAt: 'asc' },
        undefined,
        10,
      )
    })

    test('should throw error when scope is invalid', async () => {
      await expect(service.findMeetings({ ...request, scope: 'NOT_SCOPE' })).rejects.toThrow(
        new ApplicationError('Invalid Meeting Scope'),
      )
      expect(meetingRepository.findManyWithCandidate).not.toHaveBeenCalled()
    })
  })

  describe('findMeeting', () => {
    const date = new Date()
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

    test('should return existing meeting', async () => {
      meetingRepository.findByIdWithCandidate.mockResolvedValue(meeting)

      const result = await service.findMeeting(1)

      expect(meetingRepository.findByIdWithCandidate).toHaveBeenCalledWith(1)
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
      meetingRepository.findByIdWithCandidate.mockResolvedValue(undefined)

      await expect(service.findMeeting(1)).rejects.toThrow(
        new ApplicationError('Meeting Not Found'),
      )
      expect(meetingRepository.findByIdWithCandidate).toHaveBeenCalledWith(1)
      expect(meetingRepository.update).not.toHaveBeenCalled()
    })
  })
})
