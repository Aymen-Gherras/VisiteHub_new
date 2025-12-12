import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Interceptor to ensure all JSON responses have proper charset=utf-8 header
 * This is critical for emoji support in API responses
 */
@Injectable()
export class CharsetInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    
    // Ensure Content-Type includes charset=utf-8 for JSON responses
    // This is essential for proper emoji encoding
    const originalJson = response.json.bind(response);
    response.json = function(data: any) {
      if (!response.getHeader('Content-Type')) {
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
      } else {
        const currentContentType = response.getHeader('Content-Type') as string;
        if (!currentContentType.includes('charset')) {
          response.setHeader('Content-Type', `${currentContentType}; charset=utf-8`);
        } else if (!currentContentType.includes('charset=utf-8')) {
          // Replace existing charset with utf-8
          response.setHeader('Content-Type', currentContentType.replace(/charset=[^;]+/, 'charset=utf-8'));
        }
      }
      return originalJson(data);
    };

    return next.handle().pipe(
      tap(() => {
        // Ensure charset is set even if json() wasn't called
        const contentType = response.getHeader('Content-Type') as string;
        if (contentType && contentType.includes('application/json') && !contentType.includes('charset')) {
          response.setHeader('Content-Type', `${contentType}; charset=utf-8`);
        }
      }),
    );
  }
}

