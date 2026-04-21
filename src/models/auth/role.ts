import { RoleProps } from '~/types/auth/role.type'

export class Role {
  private props: RoleProps

  constructor(props: RoleProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date()
    }
  }

  get name() {
    return this.props.name
  }

  toJson(){
    return this.props
  }
}
