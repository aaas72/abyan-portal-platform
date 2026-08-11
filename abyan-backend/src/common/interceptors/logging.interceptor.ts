import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LogsService } from '../../logs/logs.service';

/**
 * قائمة منع لا قائمة سماح: أي مفتاح يطابق هذا النمط يُنقَّح.
 * الاعتماد على تعداد المفاتيح الحسّاسة يدوياً يفشل مع أول حقل جديد يُضاف.
 */
const SENSITIVE_KEY = /pass|token|secret|otp|auth|credential|cookie|session/i;

/** الحد الأقصى لطول الحمولة المسجّلة — يمنع تضخّم ملف السجل بمحتوى كبير */
const MAX_PAYLOAD_LENGTH = 2000;

function redactSensitive(value: unknown, depth = 0): unknown {
  if (depth > 5 || value === null || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => redactSensitive(item, depth + 1));
  }
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, val]) => [
      key,
      SENSITIVE_KEY.test(key)
        ? '***REDACTED***'
        : redactSensitive(val, depth + 1),
    ]),
  );
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logsService: LogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const { method, url, ip } = req;
    const now = Date.now();

    // Only log mutations (POST, PUT, PATCH, DELETE) to prevent log flooding
    // We can allow login POST if we want
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    let payload = '';
    if (req.body && Object.keys(req.body).length > 0) {
      payload = JSON.stringify(redactSensitive(req.body)).slice(
        0,
        MAX_PAYLOAD_LENGTH,
      );
    }

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        const status = res.statusCode;
        // The user ID might be available if JwtAuthGuard populated req.user
        // JwtStrategy.validate يعيد الحقل باسم userId لا id
        const userId = req.user?.userId || req.user?.username || undefined;

        this.logsService.logOperation({
          timestamp: new Date().toISOString(),
          ip: req.ip || ip,
          userId,
          method,
          url,
          status,
          responseTime,
          payload,
        });
      }),
      catchError((error) => {
        const responseTime = Date.now() - now;
        const status = error.getStatus ? error.getStatus() : 500;
        // JwtStrategy.validate يعيد الحقل باسم userId لا id
        const userId = req.user?.userId || req.user?.username || undefined;

        this.logsService.logOperation({
          timestamp: new Date().toISOString(),
          ip: req.ip || ip,
          userId,
          method,
          url,
          status,
          responseTime,
          payload,
          error: error.message || 'Internal Server Error',
        });

        return throwError(() => error);
      }),
    );
  }
}
