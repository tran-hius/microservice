import { TokenProps } from '~/types/auth/token.type'

export class Token {
  private props: TokenProps

  constructor(props: TokenProps) {
    this.props = {
      ...props,
      isRevoked: props.isRevoked ?? false,
      createdAt: props.createdAt ?? new Date()
    }
  }

  get userId() {
    return this.props.userId
  }
  get token() {
    return this.props.token
  }
  get expiresAt() {
    return this.props.expiresAt
  }
  get isRevoked() {
    return this.props.isRevoked
  }

  isValid(): boolean {
    return !this.props.isRevoked && new Date() < this.props.expiresAt
  }

  toJson() {
    return { ...this.props }
  }
}
