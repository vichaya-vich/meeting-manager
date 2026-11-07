import { RequestHandler } from 'express'
import { MeetingCreateRequestDto } from '../dto/meeting-request.dto'
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
}
