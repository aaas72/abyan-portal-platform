import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  data: T;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        // If the data is already paginated (has items and meta), just structure it
        if (data && data.items && data.meta) {
          return {
            statusCode: response.statusCode,
            data: data.items,
            meta: data.meta,
          };
        }

        return {
          statusCode: response.statusCode,
          data: data,
        };
      }),
    );
  }
}
