import { RoleProps } from '~/types/auth/role.type'

export class Role {
  private props: RoleProps

  constructor(props: RoleProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date()
    }
  }

  get id() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  toJson() {
    return this.props
  }
}
