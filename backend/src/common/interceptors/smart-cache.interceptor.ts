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
import { Reflector } from '@nestjs/core';
import type { Cache } from 'cache-manager';
import { DISABLE_CACHE_KEY } from '../decorators/disable-cache.decorator';

@Injectable()
export class SmartCacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    // Check if cache is disabled for this route
    const disableCache = this.reflector.getAllAndOverride<boolean>(
      DISABLE_CACHE_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Only cache GET requests and if cache is not disabled
    if (method !== 'GET' || disableCache) {
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
          // Use short TTL for list endpoints (30 seconds) to balance freshness and performance
          // Individual item endpoints can use longer TTL (5 minutes)
          const isListEndpoint = url.includes('/api/properties') && !url.match(/\/api\/properties\/[^/]+$/);
          const isBlogListEndpoint = url.includes('/api/blog') && !url.match(/\/api\/blog\/[^/]+$/);
          const isUsersListEndpoint = url.includes('/api/users') && !url.match(/\/api\/users\/[^/]+$/);
          
          const ttl = (isListEndpoint || isBlogListEndpoint || isUsersListEndpoint) 
            ? 30000  // 30 seconds for list endpoints (fresh data, but still cached)
            : 300000; // 5 minutes for individual items
          
          await this.cacheManager.set(cacheKey, response, ttl);
        } catch (error) {
          // Ignore cache errors
        }
      }),
    );
  }
}

