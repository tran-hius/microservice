import { AppError } from "./app.error"


export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404)
  }
}

// Lỗi dữ liệu đầu vào không hợp lệ (400)
export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400)
  }
}

// Lỗi xác thực/đăng nhập (401)
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403)
  }
}

// Lỗi xung đột dữ liệu (409) - Rất hay dùng trong Repository
// Ví dụ: Đăng ký email đã tồn tại, hoặc tạo userName đã có người dùng
export class ConflictError extends AppError {
  constructor(message = 'Conflict with existing data') {
    super(message, 409)
  }
}

// Lỗi quá tải/quá nhiều yêu cầu (429)
// Dùng khi bạn setup Rate Limiting để chặn spam
export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests, please try again later') {
    super(message, 429)
  }
}

// Lỗi máy chủ không xác định (500)
// Dùng khi bạn muốn ném một lỗi cụ thể mà bạn biết chắc là do phía server
export class InternalServerError extends AppError {
  constructor(message = 'Something went wrong on our end') {
    super(message, 500)
  }
}
