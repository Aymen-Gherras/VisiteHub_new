import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    // Only cache GET requests
    if (method !== 'GET') {
      return next.handle();
    }

    // Generate cache key from request
    const cacheKey = `${method}:${url}`;

    // Try to get from cache
    try {
      const cached = await this.cacheManager.get(cacheKey);
      if (cached) {
        return of(cached);
      }
    } catch (error) {
      // Cache not available, continue
    }

    // If not cached, proceed and cache the response
    return next.handle().pipe(
      tap(async (response) => {
        try {
          // Cache for 5 minutes (300000ms)
          await this.cacheManager.set(cacheKey, response, 300000);
        } catch (error) {
          // Ignore cache errors
        }
      }),
    );
  }
}

