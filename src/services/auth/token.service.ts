import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { ITokenRepository } from '../../interfaces/ITokenRepository'
import { Token } from '~/models/auth/token'
import { User } from '~/models/auth/user'
export class TokenService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'super_secret'
  private readonly jwtExpiresIn = '2m'

  constructor(private tokenRepository: ITokenRepository) {}

  async generateAuthTokens(user: User) {
    const accessToken = this.generateAccessToken(user)
    const refreshToken = await this.generateRefreshToken(user.id!)

    return { accessToken, refreshToken }
  }

  private generateAccessToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles
    }
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn })
  }

  private async generateRefreshToken(userId: number): Promise<string> {
    const tokenString = crypto.randomBytes(40).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const tokenModel = new Token({
      userId,
      token: tokenString,
      expiresAt
    })

    await this.tokenRepository.create(tokenModel)
    return tokenString
  }

  async verifyRefreshToken(token: string): Promise<Token | null> {
    const storedToken = await this.tokenRepository.findByToken(token)
    if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
      return null
    }
    return storedToken
  }

  async revokeUserTokens(userId: number): Promise<void> {
    await this.tokenRepository.revokeByUserId(userId)
  }
}
