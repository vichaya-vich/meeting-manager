import express from 'express'
import { errorHandler } from './handlers/error.handler'
import { prisma } from './lib/prisma'
import { meetingRouter } from './routes/meeting.route'

const app = express()

app.use(express.json())
app.use('/api/meetings', meetingRouter(prisma))
app.use(errorHandler)

export default app
