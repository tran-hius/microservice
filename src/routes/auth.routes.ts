import { Router } from 'express'
import { AuthController } from '~/controllers/auth.controller'
import { AuthService } from '~/services/auth/auth.service'
import { AuthRepository } from '~/repositories/auth/auth.repository'

const router = Router()

const authRepository = new AuthRepository()
const authService = new AuthService(authRepository)
const authController = new AuthController(authService)

/**
 * @route   POST /api/v1/auth/register
 * @desc    Đăng ký tài khoản mới và gán role mặc định
 */

router.post('/register', authController.register)

export default router
