import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const { combine, timestamp, printf, colorize, errors } = winston.format

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return stack ? `${timestamp} [${level}]: ${message} - ${stack}` : `${timestamp} [${level}]: ${message}`
})

// log xoay theo ngày
const fileRotateTransport = new DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d' // giữ log 14 ngày
})

// log riêng error
const errorRotateTransport = new DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '20m',
  maxFiles: '30d'
})

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(timestamp(), errors({ stack: true }), logFormat),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), errors({ stack: true }), logFormat)
    }),
    fileRotateTransport,
    errorRotateTransport
  ]
})
