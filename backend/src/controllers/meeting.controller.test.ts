import { NextFunction, Request, Response } from 'express'
import { afterEach, beforeEach, describe, expect, Mock, test, vi } from 'vitest'
import { MeetingCreateRequestDto } from '../dto/meeting-request.dto'
import { MeetingService } from '../services/meeting.service'
import { MeetingController } from './meeting.controller'

describe('MeetingController', () => {
  let meetingService: { createMeeting: Mock }
  let controller: MeetingController
  let response: Response
  let next: NextFunction

  beforeEach(() => {
    meetingService = { createMeeting: vi.fn() }
    controller = new MeetingController(meetingService as unknown as MeetingService)

    response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response
    next = vi.fn()
  })

  afterEach(() => vi.clearAllMocks())

  describe('createMeeting', () => {
    const body = { name: 'name' }
    const request = { body } as Request<{}, {}, MeetingCreateRequestDto>

    test('should response 201 with the created meeting', async () => {
      const created = { id: 1, ...body }
      meetingService.createMeeting.mockResolvedValue(created)

      await controller.createMeeting(request, response, next)

      expect(meetingService.createMeeting).toHaveBeenCalledWith(body)
      expect(response.status).toHaveBeenCalledWith(201)
      expect(response.json).toHaveBeenCalledWith(created)
      expect(next).not.toHaveBeenCalled()
    })

    test('should pass error to next when service error', async () => {
      const error = new Error('error')
      meetingService.createMeeting.mockRejectedValue(error)

      await controller.createMeeting(request, response, next)

      expect(next).toHaveBeenCalledWith(error)
      expect(response.status).not.toHaveBeenCalled()
      expect(response.json).not.toHaveBeenCalled()
    })
  })
})
