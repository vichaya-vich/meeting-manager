import { NextFunction, Request, Response } from 'express'
import { afterEach, beforeEach, describe, expect, Mock, test, vi } from 'vitest'
import { MeetingCreateRequestDto, MeetingUpdateRequestDto } from '../dto/meeting-request.dto'
import { MeetingService } from '../services/meeting.service'
import { MeetingController } from './meeting.controller'

describe('MeetingController', () => {
  let meetingService: {
    createMeeting: Mock
    updateMeeting: Mock
    cancelMeeting: Mock
    feedback: Mock
    findMeetings: Mock
  }
  let controller: MeetingController
  let response: Response
  let next: NextFunction

  beforeEach(() => {
    meetingService = {
      createMeeting: vi.fn(),
      updateMeeting: vi.fn(),
      cancelMeeting: vi.fn(),
      feedback: vi.fn(),
      findMeetings: vi.fn(),
    }
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

  describe('updateMeeting', () => {
    const params = { id: '1' }
    const body = { name: 'name' }
    const request = { params, body } as Request<{ id: string }, {}, MeetingUpdateRequestDto>

    test('should response 200 with the updated meeting', async () => {
      const updated = { id: 1, ...body }
      meetingService.updateMeeting.mockResolvedValue(updated)

      await controller.updateMeeting(request, response, next)

      expect(meetingService.updateMeeting).toHaveBeenCalledWith(1, body)
      expect(response.status).toHaveBeenCalledWith(200)
      expect(response.json).toHaveBeenCalledWith(updated)
      expect(next).not.toHaveBeenCalled()
    })

    test('should pass error to next when service error', async () => {
      const error = new Error('error')
      meetingService.updateMeeting.mockRejectedValue(error)

      await controller.updateMeeting(request, response, next)

      expect(next).toHaveBeenCalledWith(error)
      expect(response.status).not.toHaveBeenCalled()
      expect(response.json).not.toHaveBeenCalled()
    })
  })

  describe('cancelMeeting', () => {
    const params = { id: '1' }
    const request = { params } as Request<{ id: string }>

    test('should response 200 with response data', async () => {
      const updated = { id: 1 }
      meetingService.cancelMeeting.mockResolvedValue(updated)

      await controller.cancelMeeting(request, response, next)

      expect(meetingService.cancelMeeting).toHaveBeenCalledWith(1)
      expect(response.status).toHaveBeenCalledWith(200)
      expect(response.json).toHaveBeenCalledWith(updated)
      expect(next).not.toHaveBeenCalled()
    })

    test('should pass error to next when service error', async () => {
      const error = new Error('error')
      meetingService.cancelMeeting.mockRejectedValue(error)

      await controller.cancelMeeting(request, response, next)

      expect(next).toHaveBeenCalledWith(error)
      expect(response.status).not.toHaveBeenCalled()
      expect(response.json).not.toHaveBeenCalled()
    })
  })

  describe('feedbackMeeting', () => {
    const params = { id: '1' }
    const body = { feedback: 'feedback' }
    const request = { params, body } as Request<{ id: string }, {}, { feedback: string }>

    test('should response 200 with response data', async () => {
      const updated = { id: 1 }
      meetingService.feedback.mockResolvedValue(updated)

      await controller.feedbackMeeting(request, response, next)

      expect(meetingService.feedback).toHaveBeenCalledWith(1, body.feedback)
      expect(response.status).toHaveBeenCalledWith(200)
      expect(response.json).toHaveBeenCalledWith(updated)
      expect(next).not.toHaveBeenCalled()
    })

    test('should pass error to next when service error', async () => {
      const error = new Error('error')
      meetingService.feedback.mockRejectedValue(error)

      await controller.feedbackMeeting(request, response, next)

      expect(next).toHaveBeenCalledWith(error)
      expect(response.status).not.toHaveBeenCalled()
      expect(response.json).not.toHaveBeenCalled()
    })
  })

  describe('getMeetings', () => {
    const query = { scope: 'scope1' }
    const request = { query } as Request<{}, {}, {}, { scope: string }>

    test('should response 200 with response data', async () => {
      const meetings = [{ id: 1 }]
      meetingService.findMeetings.mockResolvedValue(meetings)

      await controller.getMeetings(request, response, next)

      expect(meetingService.findMeetings).toHaveBeenCalledWith('scope1')
      expect(response.status).toHaveBeenCalledWith(200)
      expect(response.json).toHaveBeenCalledWith(meetings)
      expect(next).not.toHaveBeenCalled()
    })

    test('should pass error to next when service error', async () => {
      const error = new Error('error')
      meetingService.findMeetings.mockRejectedValue(error)

      await controller.getMeetings(request, response, next)

      expect(next).toHaveBeenCalledWith(error)
      expect(response.status).not.toHaveBeenCalled()
      expect(response.json).not.toHaveBeenCalled()
    })
  })
})
