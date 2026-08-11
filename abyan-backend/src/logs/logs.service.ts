import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface LogEntry {
  timestamp: string;
  ip: string;
  userId?: string;
  method: string;
  url: string;
  status: number;
  responseTime: number;
  payload?: string;
  error?: string;
}

@Injectable()
export class LogsService {
  private readonly logger = new Logger(LogsService.name);
  private readonly logsDirectory = path.join(process.cwd(), 'logs');
  private readonly logFilePath = path.join(this.logsDirectory, 'platform-logs.csv');

  constructor() {
    this.initializeLogFile();
  }

  private initializeLogFile() {
    try {
      if (!fs.existsSync(this.logsDirectory)) {
        fs.mkdirSync(this.logsDirectory, { recursive: true });
      }

      if (!fs.existsSync(this.logFilePath)) {
        // Create file with CSV headers
        const headers = 'Timestamp,IP,UserId,Method,URL,Status,ResponseTimeMs,Payload,Error\n';
        fs.writeFileSync(this.logFilePath, headers, 'utf8');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to initialize log file: ${errorMessage}`);
    }
  }

  private escapeCsvValue(value: string | undefined): string {
    if (!value) return '';
    // Prevent CSV formula injection by prepending a single quote
    let safeValue = value;
    if (/^[=+\-@]/.test(safeValue)) {
      safeValue = "'" + safeValue; // formula injection for [=+-@]
    }
    // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
    if (safeValue.includes(',') || safeValue.includes('"') || safeValue.includes('\n')) {
      return `"${safeValue.replace(/"/g, '""')}"`;
    }
    return safeValue;
  }

  logOperation(entry: LogEntry) {
    try {
      this.rotateLogFileIfNeeded();
      
      const row = [
        this.escapeCsvValue(entry.timestamp),
        this.escapeCsvValue(entry.ip),
        this.escapeCsvValue(entry.userId || 'N/A'),
        this.escapeCsvValue(entry.method),
        this.escapeCsvValue(entry.url),
        entry.status.toString(),
        entry.responseTime.toString(),
        this.escapeCsvValue(entry.payload),
        this.escapeCsvValue(entry.error),
      ].join(',') + '\n';

      fs.appendFile(this.logFilePath, row, 'utf8', (err) => {
        if (err) {
          this.logger.error(`Failed to write log entry: ${err.message}`);
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to process log entry: ${errorMessage}`);
    }
  }

  private rotateLogFileIfNeeded() {
    try {
      if (fs.existsSync(this.logFilePath)) {
        const stats = fs.statSync(this.logFilePath);
        const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
        
        if (stats.size > MAX_SIZE) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const rotatedFilePath = path.join(this.logsDirectory, `platform-logs-${timestamp}.csv`);
          fs.renameSync(this.logFilePath, rotatedFilePath);
          this.initializeLogFile();
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to rotate log file: ${errorMessage}`);
    }
  }
}
