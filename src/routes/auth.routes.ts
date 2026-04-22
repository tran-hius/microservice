import { Router } from 'express'
import { AuthController } from '~/controllers/auth.controller'
import { AuthService } from '~/services/auth/auth.service'
import { AuthRepository } from '~/repositories/auth/auth.repository'
import { TokenService } from '~/services/auth/token.service'
import { TokenRepository } from '~/repositories/auth/token.repository'

const router = Router()

const authRepository = new AuthRepository()
const tokenRepository = new TokenRepository()
const tokenService = new TokenService(tokenRepository)
const authService = new AuthService(authRepository, tokenService)
const authController = new AuthController(authService)

/**
 * @route   POST /api/v1/auth/register
 * @desc    Đăng ký tài khoản mới và gán role mặc định
 */

router.post('/register', authController.register)
router.post('/login', authController.login)

export default router
