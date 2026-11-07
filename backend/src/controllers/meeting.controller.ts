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
      response.status(201).json(await this.meetingService.createMeeting(request.body))
    } catch (error) {
      next(error)
    }
  }
}
