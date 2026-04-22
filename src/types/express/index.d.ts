import { UserProps } from '../auth/user.type' // Đường dẫn tới file type của bạn

declare global {
  namespace Express {
    interface Request {
      // Bạn định nghĩa cấu trúc user sẽ có trong token ở đây
      user?: {
        id: number
        email: string
        roles: string[]
      }
    }
  }
}

export {}
