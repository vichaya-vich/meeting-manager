import express from 'express'
import { errorHandler } from './handlers/error.handler'
import { prisma } from './lib/prisma'
import { candidateRouter } from './routes/candidate.route'
import { meetingRouter } from './routes/meeting.route'

const app = express()

app.use(express.json())
app.use('/api/meetings', meetingRouter(prisma))
app.use('/api/candidates', candidateRouter(prisma))
app.use(errorHandler)

export default app
