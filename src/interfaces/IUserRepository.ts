import { User } from '~/models/auth/user'
import { UserRole } from '~/models/auth/user.role'

export interface IUserRepository {
  findById(id: number): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(user: Omit<User, 'id'>): Promise<User>
  update(id: number, user: Partial<User>): Promise<boolean>
  delete(id: number): Promise<boolean>
  assignRole(userRole: UserRole): Promise<void>
}
