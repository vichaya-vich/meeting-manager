import express from 'express'
import { validateData } from '../middlewares/validation.middleware'
import { meetingCreateSchema } from '../schemas/meeting.schema'
import * as meetingController from '../controllers/meeting.controller'

const meetingRouter = express.Router()

meetingRouter.post('/', validateData(meetingCreateSchema), meetingController.createMeeting)

export default meetingRouter
