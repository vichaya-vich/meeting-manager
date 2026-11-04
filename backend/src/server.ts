import { config } from 'dotenv'
import app from './app'

config({ path: `.env.${process.env.NODE_ENV ?? 'development'}` })

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => console.log(`Listening on :${PORT}`))
