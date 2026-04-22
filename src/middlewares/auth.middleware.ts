import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '~/utils/errors'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return next(new UnauthorizedError('Bạn cần đăng nhập để thực hiện hành động này.'))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_access_secret') as any

    req.user = {
      id: decoded.id,
      email: decoded.email,
      roles: decoded.roles
    }

    next()
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Access token đã hết hạn.'))
    }
    next(new UnauthorizedError('Token không hợp lệ.'))
  }
}
