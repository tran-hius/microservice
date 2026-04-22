import { Token } from '~/models/auth/token'

export interface ITokenRepository {
  create(token: Token): Promise<void>
  findByToken(token: string): Promise<Token | null>
  revokeByUserId(userId: number): Promise<void> // Dùng khi đăng xuất
  deleteExpired(): Promise<void> // Dọn dẹp token hết hạn
}
