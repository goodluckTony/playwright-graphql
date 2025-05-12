import dotenv from 'dotenv';
dotenv.config();

export class Logger {
  private static debugMode = process.env.DEBUG === 'true';

  private static getTimestamp(): string {
    return new Date().toISOString();
  }

  static log(title: string, payload: unknown) {
    if (!this.debugMode) return;
    console.log(`[${this.getTimestamp()}] ${title}:`);
    console.dir(payload, { depth: null });
  }

  static error(title: string, error: unknown) {
    if (!this.debugMode) return;
    console.error(`[${this.getTimestamp()}] ${title}:`);
    console.dir(error, { depth: null });
  }
}
