import express from 'express'
import { MeetingController } from '../controllers/meeting.controller'
import { PrismaClient } from '../generated/prisma/client'
import { validateData } from '../middlewares/validation.middleware'
import { MeetingRepository } from '../repositories/meeting.repository'
import { meetingCancelSchema } from '../schemas/meeting-cancel.schema'
import { meetingCreateSchema } from '../schemas/meeting-create.schema'
import { meetingFeedbackSchema } from '../schemas/meeting-feedback.schema'
import { meetingUpdateSchema } from '../schemas/meeting-update.schema'
import { MeetingService } from '../services/meeting.service'

export const meetingRouter = (prisma: PrismaClient) => {
  const router = express.Router()
  const repository = new MeetingRepository(prisma)
  const service = new MeetingService(repository)
  const controller = new MeetingController(service)

  router.post('/', validateData(meetingCreateSchema), controller.createMeeting)
  router.put('/:id', validateData(meetingUpdateSchema), controller.updateMeeting)
  router.put('/:id/cancel', validateData(meetingCancelSchema), controller.cancelMeeting)
  router.put('/:id/feedback', validateData(meetingFeedbackSchema), controller.feedbackMeeting)

  return router
}
