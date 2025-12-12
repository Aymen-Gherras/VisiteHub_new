import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheInvalidationService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Invalidate cache for a specific route pattern
   * Uses Redis pattern matching if available, otherwise tries common key patterns
   * @param routePattern - Route pattern to invalidate (e.g., '/api/properties', '/api/blog')
   */
  async invalidateRoute(routePattern: string): Promise<void> {
    try {
      // Try Redis pattern matching first (if using Redis)
      const store = (this.cacheManager as any).store;
      if (store && store.client && typeof store.client.keys === 'function') {
        // Redis store - use pattern matching
        try {
          const pattern = `GET:${routePattern}*`;
          const keys = await store.client.keys(pattern);
          if (keys && keys.length > 0) {
            await Promise.all(keys.map((key: string) => store.client.del(key)));
            if (process.env.NODE_ENV !== 'production') {
              console.log(`Invalidated ${keys.length} cache keys matching pattern: ${pattern}`);
            }
          }
        } catch (redisError) {
          // Fall back to manual key deletion
          if (process.env.NODE_ENV !== 'production') {
            console.warn('Redis pattern matching failed, using manual deletion:', redisError);
          }
        }
      }

      // Manual key deletion for in-memory cache or as fallback
      const methods = ['GET'];
      const keysToDelete: string[] = [];

      for (const method of methods) {
        // Exact route match
        keysToDelete.push(`${method}:${routePattern}`);
        // Route with query params variations
        keysToDelete.push(`${method}:${routePattern}?`);
        // Common query param combinations
        for (let limit = 10; limit <= 100; limit += 10) {
          for (let offset = 0; offset <= 200; offset += 20) {
            keysToDelete.push(`${method}:${routePattern}?limit=${limit}&offset=${offset}`);
            keysToDelete.push(`${method}:${routePattern}?offset=${offset}&limit=${limit}`);
          }
        }
        // Without offset
        for (let limit = 10; limit <= 100; limit += 10) {
          keysToDelete.push(`${method}:${routePattern}?limit=${limit}`);
        }
      }

      // Delete all possible keys
      let deletedCount = 0;
      for (const key of keysToDelete) {
        try {
          const result = await this.cacheManager.del(key);
          if (result) deletedCount++;
        } catch (error) {
          // Ignore individual deletion errors
        }
      }

      if (process.env.NODE_ENV !== 'production' && deletedCount > 0) {
        console.log(`Invalidated ${deletedCount} cache keys for route: ${routePattern}`);
      }
    } catch (error) {
      // Ignore cache invalidation errors
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`Cache invalidation failed for route ${routePattern}:`, error);
      }
    }
  }

  /**
   * Clear all cache entries (nuclear option)
   * Use with caution - clears everything
   */
  async clearAllCache(): Promise<void> {
    try {
      const store = (this.cacheManager as any).store;
      if (store && store.client && typeof store.client.flushdb === 'function') {
        // Redis - flush database
        await store.client.flushdb();
        if (process.env.NODE_ENV !== 'production') {
          console.log('Cleared all Redis cache');
        }
      } else {
        // In-memory cache - try to reset
        if (store && typeof store.reset === 'function') {
          await store.reset();
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Failed to clear all cache:', error);
      }
    }
  }

  /**
   * Invalidate all cache entries for properties
   */
  async invalidateProperties(): Promise<void> {
    // Invalidate all property-related routes
    await Promise.all([
      this.invalidateRoute('/api/properties'),
      this.invalidateRoute('/api/properties/featured'),
      // Also try without /api prefix (in case cache key format differs)
      this.invalidateRoute('/properties'),
      this.invalidateRoute('/properties/featured'),
    ]);
  }

  /**
   * Invalidate all cache entries for blog
   */
  async invalidateBlog(): Promise<void> {
    await Promise.all([
      this.invalidateRoute('/api/blog'),
    ]);
  }

  /**
   * Invalidate all cache entries for users
   */
  async invalidateUsers(): Promise<void> {
    await Promise.all([
      this.invalidateRoute('/api/users'),
    ]);
  }

  /**
   * Invalidate cache for a specific property by ID
   */
  async invalidateProperty(id: string): Promise<void> {
    // Invalidate the specific property and all list endpoints
    await Promise.all([
      this.invalidateRoute(`/api/properties/${id}`),
      this.invalidateRoute(`/properties/${id}`), // Without /api prefix
      this.invalidateRoute(`/api/properties/slug`), // Invalidate slug-based lookups too
      this.invalidateProperties(), // Also invalidate all list endpoints
    ]);
  }

  /**
   * Invalidate cache for a specific blog post by ID
   */
  async invalidateBlogPost(id: string): Promise<void> {
    await Promise.all([
      this.invalidateRoute(`/api/blog/${id}`),
      this.invalidateRoute(`/api/blog/slug`), // Invalidate slug-based lookups too
      this.invalidateBlog(), // Also invalidate list endpoints
    ]);
  }
}

