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

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body
      const result = await this.authService.login(email, password)

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 
      })

      return res.status(200).json({
        status: 'success',
        message: 'User logged successfully',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }
}
