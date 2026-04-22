import { UserProps } from '../../types/auth/user.type'

export class User {
  private props: UserProps

  constructor(props: UserProps) {
    this.props = {
      ...props,
      isBanned: props.isBanned ?? false,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
      roles: props.roles || []
    }
  }

  get id() {
    return this.props.id
  }

  get fullName() {
    return this.props.fullName
  }

  get userName() {
    return this.props.userName
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get isBanned() {
    return this.props.isBanned
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get roles() {
    return this.props.roles || []
  }

  set fullName(value: string) {
    this.props.fullName = value
    this.touch()
  }

  set userName(value: string) {
    this.props.userName = value
    this.touch()
  }

  set email(value: string) {
    this.props.email = value
    this.touch()
  }

  set password(value: string) {
    this.props.password = value
    this.touch()
  }

  setId(id: number) {
    if (this.props.id) {
      throw new Error('ID already set')
    }
    this.props.id = id
  }

  ban() {
    this.props.isBanned = true
    this.touch()
  }

  unban() {
    this.props.isBanned = false
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  toJson() {
    const { password, ...rest } = this.props
    return rest
  }
}
