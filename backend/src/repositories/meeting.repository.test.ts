import { afterEach, beforeEach, describe, expect, Mock, test, vi } from 'vitest'
import { Role } from '../enums/role.enum'
import { MeetingStatus, MeetingType, PrismaClient } from '../generated/prisma/client'
import { CreateMeetingWithCandidateInput } from '../interfaces/meeting.interface'
import { MeetingRepository } from '../repositories/meeting.repository'

describe('MeetingRepository', () => {
  let prisma: { meeting: { create: Mock } }
  let repository: MeetingRepository

  beforeEach(() => {
    prisma = { meeting: { create: vi.fn() } }
    repository = new MeetingRepository(prisma as unknown as PrismaClient)
  })

  afterEach(() => vi.clearAllMocks())

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
})
