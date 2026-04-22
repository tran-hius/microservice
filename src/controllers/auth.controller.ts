import { Request, Response, NextFunction } from 'express'
import { AuthService } from '~/services/auth/auth.service'

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body

      const result = await this.authService.register(userData)

      return res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }
}
