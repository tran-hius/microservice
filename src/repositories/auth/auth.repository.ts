// src/infrastructure/repositories/MySQLUserRepository.ts
import { Pool } from 'mysql2/promise'
import { IAuthRepository } from '../../interfaces/auth-repository.interface'
import { User } from '../../models/auth/user'
import { Database } from '~/config/database'
import { logger } from '~/utils/logger'
import { UserProps } from '~/types/auth/user.type'
import { UserRole } from '~/models/auth/user.role'

export class AuthRepository implements IAuthRepository {
  private pool: Pool

  constructor() {
    this.pool = Database.getInstance()
  }

  // Hàm phụ trợ (Helper) để "đúc" dữ liệu thô thành Class User
  private mapToModel(raw: any): User {
    return new User({
      id: raw.id,
      fullName: raw.fullName || raw.full_name, // Dự phòng cả 2 cách đặt tên
      userName: raw.userName || raw.user_name,
      email: raw.email,
      password: raw.password,
      isBanned: Boolean(raw.isBanned || raw.is_banned),
      createdAt: raw.createdAt || raw.created_at,
      updatedAt: raw.updatedAt || raw.updated_at
    })
  }

  async findById(id: number): Promise<User | null> {
    try {
      const [rows]: any = await this.pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id])

      // Không được trả về rows[0] trực tiếp, phải đi qua mapToModel
      return rows.length ? this.mapToModel(rows[0]) : null
    } catch (error) {
      logger.error(`[MySQLUserRepository] Lỗi findById(${id}):`, error)
      throw error
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const [rows]: any = await this.pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email])

      return rows.length ? this.mapToModel(rows[0]) : null
    } catch (error) {
      logger.error(`[MySQLUserRepository] Lỗi findByEmail(${email}):`, error)
      throw error
    }
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    try {
      // Vì 'user' truyền vào là Class Instance, ta truy cập qua getter
      const [result]: any = await this.pool.query(
        `INSERT INTO users (fullName, userName, email, password) VALUES (?, ?, ?, ?)`,
        [user.fullName, user.userName, user.email, user.password]
      )

      // Cần tạo props để đúc ra instance mới có kèm ID
      const props: UserProps = {
        id: result.insertId,
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
        password: user.password,
        isBanned: user.isBanned,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }

      return new User(props)
    } catch (error) {
      logger.error('[MySQLUserRepository] Lỗi create user:', error)
      throw error
    }
  }

  async update(id: number, user: Partial<User>): Promise<boolean> {
    try {
      // Lưu ý: user ở đây là Partial<User>, việc lặp Object.keys
      // có thể lấy nhầm các phương thức private.
      // Nên lọc ra các trường dữ liệu thực sự cần update.
      const updateData: any = {}
      if (user.fullName) updateData.fullName = user.fullName
      if (user.userName) updateData.userName = user.userName
      if (user.email) updateData.email = user.email
      if (user.password) updateData.password = user.password

      const fields = Object.keys(updateData)
      const values = Object.values(updateData)

      if (fields.length === 0) return false

      const setClause = fields.map((f) => `${f} = ?`).join(', ')
      const [result]: any = await this.pool.query(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, id])

      return result.affectedRows > 0
    } catch (error) {
      logger.error(`[MySQLUserRepository] Lỗi update(${id}):`, error)
      throw error
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const [result]: any = await this.pool.query('DELETE FROM users WHERE id = ?', [id])
      return result.affectedRows > 0
    } catch (error) {
      logger.error(`[MySQLUserRepository] Lỗi delete(${id}):`, error)
      throw error
    }
  }

  async assignRole(userRole: UserRole): Promise<void> {
    try {
      await this.pool.query('INSERT INTO user_roles (user_id, role_id, assignedAt) VALUES (?,?,?)', [
        userRole.userId,
        userRole.roleId,
        new Date()
      ])
    } catch (error) {
      logger.error('[MySQLUserRepository]: Lỗi gán Role:', error)
      throw error
    }
  }
}
