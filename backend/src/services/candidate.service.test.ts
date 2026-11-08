import { afterEach, beforeEach, describe, expect, Mock, test, vi } from 'vitest'
import { CandidateRepository } from '../repositories/candidate.repository'
import { CandidateService } from './candidate.service'

describe('CandidateService', () => {
  let candidateRepository: {
    findManyByName: Mock
  }
  let service: CandidateService

  beforeEach(() => {
    candidateRepository = {
      findManyByName: vi.fn(),
    }
    service = new CandidateService(candidateRepository as unknown as CandidateRepository)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('findManyByName', () => {
    const candidate = { id: 1, name: 'name1' }

    test('should return list of candidate name', async () => {
      candidateRepository.findManyByName.mockResolvedValue([candidate])

      const result = await service.findCandidateNames('name1')

      expect(result.length).toBe(1)
      expect(result[0]).toEqual('name1')
      expect(candidateRepository.findManyByName).toHaveBeenCalledWith('name1')
    })
  })
})
