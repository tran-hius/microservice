import dotenv from 'dotenv'
dotenv.config()
import app from './app'
const PORT = process.env.APP_PORT || 3000
import { Database } from './config/database'
import { connectRedis } from './config/redis'

const startServer = async () => {
  try {
    await Database.connect()
    await connectRedis()
    app.listen(PORT, () => {
      console.log(`server running on port http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
