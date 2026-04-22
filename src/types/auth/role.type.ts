export enum UserRoleType {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface RoleProps {
  id?: number
  name: UserRoleType
  description?: string
  createdAt?: Date
}
