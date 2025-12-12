import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { DISABLE_CACHE_KEY } from '../decorators/disable-cache.decorator';

@Injectable()
export class CacheControlInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    // Check if cache is disabled for this route
    const disableCache = this.reflector.getAllAndOverride<boolean>(
      DISABLE_CACHE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (disableCache || request.method !== 'GET') {
      // Disable all caching for this response
      response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      response.setHeader('Pragma', 'no-cache');
      response.setHeader('Expires', '0');
    }

    return next.handle();
  }
}

