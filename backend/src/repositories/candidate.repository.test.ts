import { afterEach, beforeEach, describe, expect, Mock, test, vi } from 'vitest'
import { Role } from '../enums/role.enum'
import { PrismaClient } from '../generated/prisma/client'
import { CandidateRepository } from './candidate.repository'

describe('MeetingRepository', () => {
  let prisma: {
    candidate: {
      findUnique: Mock
      findMany: Mock
    }
  }
  let repository: CandidateRepository

  beforeEach(() => {
    prisma = {
      candidate: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
      },
    }
    repository = new CandidateRepository(prisma as unknown as PrismaClient)
  })

  afterEach(() => vi.clearAllMocks())

  describe('findByIdAndRoleWithMeeting', () => {
    const candidate = { id: 1, name: 'name1' }

    test('should return existing candidate', async () => {
      const role = Role.FRONTEND
      prisma.candidate.findUnique.mockResolvedValue(candidate)

      const result = await repository.findByIdAndRoleWithMeeting(1, role)

      expect(result).toBe(candidate)
      expect(prisma.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: 1, meetings: { some: { role } } },
        include: { meetings: { where: { role } } },
      })
    })
  })

  describe('findManyByName', () => {
    test('should return list of candidate name', async () => {
      prisma.candidate.findMany.mockResolvedValue(['name1'])

      const result = await repository.findManyByName('name1')

      expect(result.length).toBe(1)
      expect(result[0]).toBe('name1')
      expect(prisma.candidate.findMany).toHaveBeenCalledWith({
        where: { nameNormalized: { startsWith: 'name1' } },
      })
    })
  })
})
