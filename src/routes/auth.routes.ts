import { Router } from 'express'
import { AuthController } from '~/controllers/auth.controller'
import { AuthService } from '~/services/auth/auth.service'
import { UserRepository } from '~/repositories/auth/user.repository'
import { TokenService } from '~/services/auth/token.service'
import { TokenRepository } from '~/repositories/auth/token.repository'
import { authMiddleware } from '~/middlewares/auth.middleware'

const router = Router()

const userRepository = new UserRepository()
const tokenRepository = new TokenRepository()
const tokenService = new TokenService(tokenRepository)
const authService = new AuthService(userRepository, tokenService)
const authController = new AuthController(authService)

/**
 * @route   POST /api/v1/auth/register
 * @desc    Đăng ký tài khoản mới và gán role mặc định
 */

router.post('/register', authController.register)
router.post('/login', authController.login)

router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    message: 'Lấy profile thành công',
    user: req.user
  })
})

router.post('/refresh-token', authController.refreshToken)

export default router
