import { afterEach, beforeEach, describe, expect, Mock, test, vi } from 'vitest'
import { PrismaClient } from '../generated/prisma/client'
import { CandidateRepository } from './candidate.repository'

describe('MeetingRepository', () => {
  let prisma: {
    candidate: {
      findMany: Mock
    }
  }
  let repository: CandidateRepository

  beforeEach(() => {
    prisma = {
      candidate: {
        findMany: vi.fn(),
      },
    }
    repository = new CandidateRepository(prisma as unknown as PrismaClient)
  })

  afterEach(() => vi.clearAllMocks())

  describe('findManyByName', () => {
    test('should return list of candidate name', async () => {
      prisma.candidate.findMany.mockResolvedValue(['name1'])

      const result = await repository.findManyByName('name1')

      expect(result.length).toBe(1)
      expect(result[0]).toBe('name1')
      expect(prisma.candidate.findMany).toHaveBeenCalledWith({
        where: { name: { startsWith: 'name1' } },
      })
    })
  })
})
