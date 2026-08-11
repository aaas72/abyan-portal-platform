import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  StandardResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data already contains a specific message, extract it
        const message = data?.message || 'تمت العملية بنجاح';

        // Remove message from the actual data payload if it exists
        if (data && typeof data === 'object' && 'message' in data) {
          const { message: _, ...rest } = data;
          data = Object.keys(rest).length > 0 ? rest : null;
        }

        return {
          success: true,
          data: data !== undefined ? data : null,
          message,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
