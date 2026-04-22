export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true // Để phân biệt lỗi do logic app và lỗi hệ thống (crash)

    Error.captureStackTrace(this, this.constructor)
  }
}
