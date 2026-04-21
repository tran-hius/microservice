import dotenv from 'dotenv'
dotenv.config()
import app from './app'
const PORT = process.env.PORT || 8000
import { Database } from './config/database'

const startServer = async () => {
  try {
    await Database.connect()
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
