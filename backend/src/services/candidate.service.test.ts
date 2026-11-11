import { afterEach, beforeEach, describe, expect, Mock, test, vi } from 'vitest'
import { MeetingResponseDto } from '../dto/meeting-response.dto'
import { Role } from '../enums/role.enum'
import { MeetingStatus, MeetingType, Prisma } from '../generated/prisma/client'
import { ApplicationError } from '../handlers/error.handler'
import { CandidateRepository } from '../repositories/candidate.repository'
import { CandidateService } from './candidate.service'

const mappingMeetingResponse = (
  candidateId: number,
  name: string,
  meeting: Prisma.MeetingModel,
): MeetingResponseDto => ({
  id: meeting.id,
  name,
  candidateId: candidateId,
  type: meeting.type,
  status: meeting.status,
  startAt: meeting.startAt,
  endAt: meeting.endAt,
  role: meeting.role,
  note: meeting.note,
  feedback: meeting.feedback,
  createdAt: meeting.createdAt,
  updatedAt: meeting.updatedAt,
})

describe('CandidateService', () => {
  let candidateRepository: {
    findManyByName: Mock
    findByIdAndRoleWithMeeting: Mock
  }
  let service: CandidateService

  beforeEach(() => {
    candidateRepository = {
      findManyByName: vi.fn(),
      findByIdAndRoleWithMeeting: vi.fn(),
    }
    service = new CandidateService(candidateRepository as unknown as CandidateRepository)
    vi.useFakeTimers().setSystemTime(new Date('2026-11-08T10:00:00+07:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('findCandidateNames', () => {
    const candidate = { id: 1, name: 'name1' }

    test('should return list of candidate name', async () => {
      candidateRepository.findManyByName.mockResolvedValue([candidate])

      const result = await service.findCandidateNames('Name1')

      expect(result.length).toBe(1)
      expect(result[0]).toEqual('name1')
      expect(candidateRepository.findManyByName).toHaveBeenCalledWith('name1')
    })
  })

  describe('findCandidate', () => {
    const date = new Date()
    const role = Role.BACKEND
    const meeting = {
      id: 1,
      note: 'note',
      feedback: 'feedback',
      type: MeetingType.OFFLINE,
      status: MeetingStatus.PENDING,
      startAt: date,
      endAt: date,
      role,
      candidateId: 1,
      createdAt: date,
      updatedAt: date,
    }
    const candidate = {
      id: 1,
      name: 'name1',
      meetings: [
        { ...meeting, endAt: new Date('2026-11-08T15:00:00+07:00') },
        { ...meeting, endAt: new Date('2026-11-08T08:00:00+07:00') },
        {
          ...meeting,
          status: MeetingStatus.CANCELED,
          endAt: new Date('2026-11-08T15:00:00+07:00'),
        },
      ],
    }

    test('should return existing candidate', async () => {
      candidateRepository.findByIdAndRoleWithMeeting.mockResolvedValue(candidate)

      const result = await service.findCandidate(1, role)

      expect(result.id).toBe(1)
      expect(result.name).toBe(candidate.name)
      expect(result.role).toBe(role)
      expect(result.upcomings.length).toBe(1)
      expect(result.upcomings[0]).toEqual(
        mappingMeetingResponse(candidate.id, candidate.name, candidate.meetings[0]!),
      )
      expect(result.histories.length).toBe(2)
      expect(result.histories[0]).toEqual(
        mappingMeetingResponse(candidate.id, candidate.name, candidate.meetings[1]!),
      )
      expect(result.histories[1]).toEqual(
        mappingMeetingResponse(candidate.id, candidate.name, candidate.meetings[2]!),
      )
      expect(candidateRepository.findByIdAndRoleWithMeeting).toHaveBeenCalledWith(1, role)
    })

    test('should throw error when existing candidate is not found', async () => {
      candidateRepository.findByIdAndRoleWithMeeting.mockResolvedValue(undefined)

      await expect(service.findCandidate(1, role)).rejects.toThrow(
        new ApplicationError('Candidate Not Found'),
      )
      expect(candidateRepository.findByIdAndRoleWithMeeting).toHaveBeenCalledWith(1, role)
    })
  })
})
