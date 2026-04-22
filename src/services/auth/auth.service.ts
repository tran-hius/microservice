import bcrypt from 'bcrypt'
import { IAuthRepository } from '~/interfaces/auth-repository.interface'
import { User } from '~/models/auth/user'
import { UserProps } from '~/types/auth/user.type'
import { UserRole } from '~/models/auth/user.role'
import { logger } from '~/utils/logger'
import { ConflictError, ForbiddenError, NotFoundError, UnauthorizedError } from '~/utils/errors'

export class AuthService {
  constructor(private authRepository: IAuthRepository) {}

  async register(data: Omit<UserProps, 'id' | 'isBanned' | 'createdAt' | 'updatedAt'>) {
    try {
      const existingUser = await this.authRepository.findByEmail(data.email)
      if (existingUser) {
        throw new ConflictError('Email already in use')
      }
      const saltRound = 10
      const hashedPassword = await bcrypt.hash(data.password, saltRound)

      const user = new User({
        ...data,
        password: hashedPassword
      })

      const savedUser = await this.authRepository.create(user)

      const defaultRole = new UserRole({
        userId: savedUser.id!,
        roleId: 2
      })

      await this.authRepository.assignRole(defaultRole)

      logger.info(`[AuthService]: Đăng ký thành công và gán role cho ${data.email}`)

      return savedUser.toJson()
    } catch (error) {
      logger.error('[AuthService]: Lỗi đăng ký:', error)
      throw error
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.authRepository.findByEmail(email)
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

      return user.toJson()
    } catch (error) {
      logger.error('[AuthService]: Lỗi đăng nhập:', error)
      throw error
    }
  }

  async getProfile(id: number) {
    try {
      const user = await this.authRepository.findById(id)
      if (!user) throw new NotFoundError('User not found')
      return user.toJson()
    } catch (error) {
      logger.error('[AuthService]: Lỗi lấy profile:', error)
      throw error
    }
  }
}
