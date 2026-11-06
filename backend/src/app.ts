import express from 'express'
import meetingRoute from './routes/meeting.route'

const app = express()

app.use(express.json())
app.use('/api/meetings', meetingRoute)

export default app
