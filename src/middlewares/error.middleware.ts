import { Request, Response, NextFunction } from 'express'
import { AppError } from '~/utils/errors/app.error'
import { logger } from '~/utils/logger'

export const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  const error = err as any

  logger.error({
    method: req.method,
    url: req.url,
    message: error?.message,
    stack: error?.stack
  })

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      code: err.statusCode
    })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    code: 500,
    stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
  })
}
