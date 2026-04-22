import { UserRoleProps } from '~/types/auth/userRole.type'

export class UserRole {
  private props: UserRoleProps

  constructor(props: UserRoleProps) {
    this.props = {
      ...props,
      assignedAt: props.assignedAt ?? new Date()
    }
  }

  get userId() {
    return this.props.userId
  }

  get roleId() {
    return this.props.roleId
  }

  toJson() {
    return this.props
  }
}
