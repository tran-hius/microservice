import { Pool } from 'mysql2/promise'
import { ITokenRepository } from '../../interfaces/ITokenRepository'
import { Token } from '~/models/auth/token'
import { Database } from '~/config/database'

export class TokenRepository implements ITokenRepository {
  private pool: Pool

  constructor() {
    this.pool = Database.getInstance()
  }

  async create(token: Token): Promise<void> {
    const query = `
      INSERT INTO tokens (user_id, token, expires_at, is_revoked) 
      VALUES (?, ?, ?, ?)
    `
    await this.pool.query(query, [token.userId, token.token, token.expiresAt, token.isRevoked ? 1 : 0])
  }

  async findByToken(token: string): Promise<Token | null> {
    const [rows]: any = await this.pool.query('SELECT * FROM tokens WHERE token = ?', [token])

    if (rows.length === 0) return null

    return new Token({
      id: rows[0].id,
      userId: rows[0].user_id,
      token: rows[0].token,
      expiresAt: rows[0].expires_at,
      isRevoked: Boolean(rows[0].is_revoked),
      createdAt: rows[0].created_at
    })
  }

  async revokeByUserId(userId: number): Promise<void> {
    await this.pool.query('UPDATE tokens SET is_revoked = 1 WHERE user_id = ?', [userId])
  }

  async deleteExpired(): Promise<void> {
    await this.pool.query('DELETE FROM tokens WHERE expires_at < NOW()')
  }
}
