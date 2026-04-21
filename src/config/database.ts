import mysql, { Pool } from 'mysql2/promise'
import { logger } from '~/utils/logger'

export class Database {
  private static instance: Pool
  private static readonly MAX_RETRIES = 10
  private static readonly RETRY_DELAY = 5000 // 5 giây

  private constructor() {}

  /**
   * Lấy instance duy nhất của Pool (Singleton)
   */
  public static getInstance(): Pool {
    if (!Database.instance) {
      Database.instance = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT || '3306'),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        connectTimeout: 10000
      })
    }
    return Database.instance
  }

  /**
   * Kết nối với cơ chế Retry dành cho Docker Compose
   */
  public static async connect(): Promise<void> {
    let retries = Database.MAX_RETRIES

    while (retries > 0) {
      try {
        const pool = Database.getInstance()
        const connection = await pool.getConnection()

        logger.info('Database connected successfully')
        connection.release()
        return
      } catch (error) {
        retries--
        logger.warn(`[Database]: MySQL chưa sẵn sàng (Còn ${retries} lần thử)...`, error)

        if (retries === 0) {
          logger.error('[Database]: Lỗi kết nối nghiêm trọng:', error)
          process.exit(1)
        }

        // Đợi 5s trước khi thử lại
        await new Promise((res) => setTimeout(res, Database.RETRY_DELAY))
      }
    }
  }

  /**
   * Đóng toàn bộ kết nối khi tắt server (Graceful Shutdown)
   */
  public static async close(): Promise<void> {
    if (Database.instance) {
      try {
        await Database.instance.end()
        logger.info('[Database]: Đã đóng toàn bộ kết nối MySQL.')
      } catch (error) {
        logger.error('[Database]: Lỗi khi đóng kết nối MySQL:', error)
      }
    }
  }
}
