import { Pool } from 'mysql2/promise'
import { IUserRepository } from '../../interfaces/IUserRepository'
import { User } from '../../models/auth/user'
import { Database } from '~/config/database'
import { logger } from '~/utils/logger'
import { UserProps } from '~/types/auth/user.type'
import { UserRole } from '~/models/auth/user.role'

export class UserRepository implements IUserRepository {
  private pool: Pool

  constructor() {
    this.pool = Database.getInstance()
  }

  private mapToModel(row: any): User {
    return new User({
      id: row.id,
      fullName: row.full_name,
      userName: row.user_name,
      email: row.email,
      password: row.password,
      isBanned: Boolean(row.is_banned),
      roles: row.role_names ? row.role_names.split(',') : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    })
  }

  async findById(id: number): Promise<User | null> {
    try {
      const query = `
      SELECT u.*, GROUP_CONCAT(r.name) as role_names
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.id = ?
      GROUP BY u.id
      LIMIT 1
    `
      const [rows]: any = await this.pool.query(query, [id])

      return rows.length ? this.mapToModel(rows[0]) : null
    } catch (error) {
      logger.error(`[MySQLUserRepository] Lỗi findById(${id}):`, error)
      throw error
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = `
    SELECT u.*, GROUP_CONCAT(r.name) as role_names
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    WHERE u.email = ?
    GROUP BY u.id
    LIMIT 1
  `

    const [rows]: any = await this.pool.query(query, [email])

    if (rows.length === 0) return null

    return this.mapToModel(rows[0])
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    try {
      const [result]: any = await this.pool.query(
        `INSERT INTO users (full_name, user_name, email, password) VALUES (?, ?, ?, ?)`,
        [user.fullName, user.userName, user.email, user.password]
      )

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
      const updateData: any = {}

      if (user.fullName) updateData.full_name = user.fullName
      if (user.userName) updateData.user_name = user.userName
      if (user.email) updateData.email = user.email
      if (user.password) updateData.password = user.password
      if (typeof user.isBanned !== 'undefined') updateData.is_banned = user.isBanned

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
      await this.pool.query('INSERT INTO user_roles (user_id, role_id, assigned_at) VALUES (?, ?, ?)', [
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
