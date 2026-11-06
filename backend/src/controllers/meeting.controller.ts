import { NextFunction, Request, Response } from 'express'
import { MeetingCreateRequestDto } from '../dto/meeting-request.dto'
import { prisma } from '../lib/prisma'
import { MeetingRepository } from '../repositories/meeting.repository'
import { MeetingService } from '../services/meeting.service'

const meetingService = new MeetingService(new MeetingRepository(prisma))

export const createMeeting = async (
  request: Request<{}, {}, MeetingCreateRequestDto>,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    response.status(201).json(await meetingService.createMeeting(request.body))
  } catch (error) {
    next(error)
  }
}
