export interface TokenProps {
  id?: number
  userId: number
  token: string // Chuỗi Refresh Token
  expiresAt: Date // Thời điểm hết hạn
  isRevoked?: boolean // Đã bị vô hiệu hóa chưa?
  createdAt?: Date
}
