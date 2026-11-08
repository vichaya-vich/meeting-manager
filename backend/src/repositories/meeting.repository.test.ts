import { afterEach, beforeEach, describe, expect, Mock, test, vi } from 'vitest'
import { Role } from '../enums/role.enum'
import { MeetingStatus, MeetingType, PrismaClient } from '../generated/prisma/client'
import {
  CreateMeetingWithCandidateInput,
  UpdateMeetingWithCandidateInput,
} from '../interfaces/meeting.interface'
import { MeetingRepository } from '../repositories/meeting.repository'

describe('MeetingRepository', () => {
  let prisma: {
    meeting: {
      findUnique: Mock
      create: Mock
      update: Mock
    }
  }
  let repository: MeetingRepository

  beforeEach(() => {
    prisma = {
      meeting: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    }
    repository = new MeetingRepository(prisma as unknown as PrismaClient)
  })

  afterEach(() => vi.clearAllMocks())

  describe('findById', () => {
    const meeting = { name: 'John Doe' }

    test('should return existing meeting', async () => {
      prisma.meeting.findUnique.mockResolvedValue(meeting)

      const result = await repository.findById(1)

      expect(result).toEqual(meeting)
      expect(prisma.meeting.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
    })
  })

  describe('createWithCandidate', () => {
    const date = new Date()
    const input: CreateMeetingWithCandidateInput = {
      name: '  John Doe ',
      type: MeetingType.OFFLINE,
      startAt: date,
      endAt: date,
      role: Role.BACKEND,
      note: 'note',
      status: MeetingStatus.PENDING,
    }
    const created = {
      id: 1,
      note: 'note',
      type: MeetingType.OFFLINE,
      status: MeetingStatus.PENDING,
      startAt: date,
      endAt: date,
      role: Role.BACKEND,
      createdAt: date,
      updatedAt: date,
      candidate: { name: '  John Doe ', id: 3 },
    }

    test('should create new meeting and return created data', async () => {
      const { name, ...meeting } = input
      prisma.meeting.create.mockResolvedValue(created)

      const result = await repository.createWithCandidate(input)

      expect(result).toEqual(created)
      expect(prisma.meeting.create).toHaveBeenCalledWith({
        data: {
          ...meeting,
          candidate: {
            connectOrCreate: {
              where: { nameNormalized: 'john doe' },
              create: { name, nameNormalized: 'john doe' },
            },
          },
        },
        include: { candidate: true },
      })
    })
  })

  describe('updateWithCandidate', () => {
    const date = new Date()
    const input: UpdateMeetingWithCandidateInput = {
      name: '  John Doe ',
      type: MeetingType.OFFLINE,
      startAt: date,
      endAt: date,
      role: Role.BACKEND,
      note: 'note',
      status: MeetingStatus.PENDING,
    }
    const update = {
      id: 1,
      note: 'note',
      type: MeetingType.OFFLINE,
      status: MeetingStatus.PENDING,
      startAt: date,
      endAt: date,
      role: Role.BACKEND,
      createdAt: date,
      updatedAt: date,
      candidate: { name: '  John Doe ', id: 3 },
    }

    test('should update existing meeting and return updated data', async () => {
      const { name, ...meeting } = input
      prisma.meeting.update.mockResolvedValue(update)

      const result = await repository.updateWithCandidate(1, input)

      expect(result).toEqual(update)
      expect(prisma.meeting.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...meeting,
          candidate: {
            connectOrCreate: {
              where: { nameNormalized: 'john doe' },
              create: { name, nameNormalized: 'john doe' },
            },
          },
        },
        include: { candidate: true },
      })
    })
  })
})
