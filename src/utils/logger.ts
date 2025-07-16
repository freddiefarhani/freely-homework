export class Logger {
  static info(message: string, data?: unknown): void {
    console.log(`[INFO] ${message}`, data ? JSON.stringify(data) : '');
  }

  static error(message: string, error?: unknown): void {
    console.error(`[ERROR] ${message}`, error ? JSON.stringify(error) : '');
  }
  static debug(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data ? JSON.stringify(data) : '');
    }
  }
}
