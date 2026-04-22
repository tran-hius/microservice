import { createClient } from 'redis'
import { logger } from '~/utils/logger'

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
})

redisClient.on('error', (err) => logger.error('Redis Client Error', err))
redisClient.on('connect', () => logger.info('Redis Client Connected'))

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect()
  }
}

export { redisClient }