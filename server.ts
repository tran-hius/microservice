import dotenv from 'dotenv'
dotenv.config()
import app from './src/app'
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
