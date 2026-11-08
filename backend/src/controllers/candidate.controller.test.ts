import { NextFunction, Request, Response } from 'express'
import { afterEach, beforeEach, describe, expect, Mock, test, vi } from 'vitest'
import { CandidateService } from '../services/candidate.service'
import { CandidateController } from './candidate.controller'

describe('MeetingController', () => {
  let candidateService: {
    findCandidateNames: Mock
  }
  let controller: CandidateController
  let response: Response
  let next: NextFunction

  beforeEach(() => {
    candidateService = {
      findCandidateNames: vi.fn(),
    }
    controller = new CandidateController(candidateService as unknown as CandidateService)

    response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response
    next = vi.fn()
  })

  afterEach(() => vi.clearAllMocks())

  describe('getMeetings', () => {
    const query = { name: 'name1' }
    const request = { query } as Request<{}, {}, {}, { name: string }>

    test('should response 200 with response data', async () => {
      const names = ['name1']
      candidateService.findCandidateNames.mockResolvedValue(names)

      await controller.getCandidateNames(request, response, next)

      expect(candidateService.findCandidateNames).toHaveBeenCalledWith('name1')
      expect(response.status).toHaveBeenCalledWith(200)
      expect(response.json).toHaveBeenCalledWith(names)
      expect(next).not.toHaveBeenCalled()
    })

    test('should pass error to next when service error', async () => {
      const error = new Error('error')
      candidateService.findCandidateNames.mockRejectedValue(error)

      await controller.getCandidateNames(request, response, next)

      expect(next).toHaveBeenCalledWith(error)
      expect(response.status).not.toHaveBeenCalled()
      expect(response.json).not.toHaveBeenCalled()
    })
  })
})
