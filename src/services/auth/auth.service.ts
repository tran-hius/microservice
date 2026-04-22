import bcrypt from 'bcrypt'
import { IUserRepository } from '~/interfaces/IUserRepository'
import { User } from '~/models/auth/user'
import { UserProps } from '~/types/auth/user.type'
import { UserRole } from '~/models/auth/user.role'
import { logger } from '~/utils/logger'
import { ConflictError, ForbiddenError, NotFoundError, UnauthorizedError } from '~/utils/errors'
import { TokenService } from './token.service'

export class AuthService {
  constructor(
    private userRepository: IUserRepository,
    private tokenService: TokenService
  ) {}

  async register(data: Omit<UserProps, 'id' | 'isBanned' | 'createdAt' | 'updatedAt'>) {
    try {
      const existingUser = await this.userRepository.findByEmail(data.email)
      if (existingUser) {
        throw new ConflictError('Email already in use')
      }
      const saltRound = 10
      const hashedPassword = await bcrypt.hash(data.password, saltRound)

      const user = new User({
        ...data,
        password: hashedPassword
      })

      const savedUser = await this.userRepository.create(user)

      const defaultRole = new UserRole({
        userId: savedUser.id!,
        roleId: 1
      })

      await this.userRepository.assignRole(defaultRole)

      const userWithRoles = await this.userRepository.findByEmail(savedUser.email)

      logger.info(`[AuthService]: Đăng ký thành công và gán role cho ${data.email}`)

      return userWithRoles?.toJson()
    } catch (error) {
      logger.error('[AuthService]: Lỗi đăng ký:', error)
      throw error
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.userRepository.findByEmail(email)
      if (!user) {
        throw new UnauthorizedError('Invalid email or password')
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        throw new UnauthorizedError('Invalid email or password')
      }

      if (user.isBanned) {
        throw new ForbiddenError('Your account has been banned')
      }

      const tokens = await this.tokenService.generateAuthTokens(user)

      logger.info(`[AuthService]: User ${email} đăng nhập thành công.`)

      return {
        user: user.toJson(),
        ...tokens
      }
    } catch (error) {
      logger.error('[AuthService]: Lỗi đăng nhập:', error)
      throw error
    }
  }

  async getProfile(id: number) {
    try {
      const user = await this.userRepository.findById(id)
      if (!user) throw new NotFoundError('User not found')
      return user.toJson()
    } catch (error) {
      logger.error('[AuthService]: Lỗi lấy profile:', error)
      throw error
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const tokenData = await this.tokenService.verifyRefreshToken(refreshToken)
      if (!tokenData) {
        throw new ForbiddenError('Refresh token is invalid or expired')
      }
      const user = await this.userRepository.findById(tokenData.userId)
      if (!user || user.isBanned) {
        throw new ForbiddenError('User not found or has been banned')
      }

      await this.tokenService.revokeUserTokens(user.id!)

      return await this.tokenService.generateAuthTokens(user)
    } catch (error) {
      logger.error('[AuthService]: Lỗi refresh token:', error)
      throw error
    }
  }
}
