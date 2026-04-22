export interface UserProps {
  id?: number
  fullName: string
  userName: string
  email: string
  password: string
  isBanned?: boolean
  createdAt?: Date
  updatedAt?: Date
  roles?: string[]
}
