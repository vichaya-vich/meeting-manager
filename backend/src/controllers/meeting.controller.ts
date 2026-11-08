import { RequestHandler } from 'express'
import { MeetingCreateRequestDto, MeetingUpdateRequestDto } from '../dto/meeting-request.dto'
import { MeetingService } from '../services/meeting.service'

export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  createMeeting: RequestHandler<{}, {}, MeetingCreateRequestDto> = async (
    request,
    response,
    next,
  ): Promise<void> => {
    try {
      const result = await this.meetingService.createMeeting(request.body)
      response.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }

  updateMeeting: RequestHandler<{ id: string }, {}, MeetingUpdateRequestDto> = async (
    request,
    response,
    next,
  ): Promise<void> => {
    try {
      const id = Number(request.params.id)
      const result = await this.meetingService.updateMeeting(id, request.body)
      response.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  cancelMeeting: RequestHandler<{ id: string }> = async (
    request,
    response,
    next,
  ): Promise<void> => {
    try {
      const id = Number(request.params.id)
      const result = await this.meetingService.cancelMeeting(id)
      response.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  feedbackMeeting: RequestHandler<{ id: string }, {}, { feedback: string }> = async (
    request,
    response,
    next,
  ): Promise<void> => {
    try {
      const id = Number(request.params.id)
      const result = await this.meetingService.feedback(id, request.body.feedback)
      response.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  getMeetings: RequestHandler<{}, {}, {}, { scope: string }> = async (
    request,
    response,
    next,
  ): Promise<void> => {
    try {
      const result = await this.meetingService.findMeetings(request.query.scope)
      response.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  getMeeting: RequestHandler<{ id: string }> = async (request, response, next): Promise<void> => {
    try {
      const id = Number(request.params.id)
      const result = await this.meetingService.findMeeting(id)
      response.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}
