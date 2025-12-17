import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { SmartCacheInterceptor } from './common/interceptors/smart-cache.interceptor';
import { CacheControlInterceptor } from './common/interceptors/cache-control.interceptor';
import { CharsetInterceptor } from './common/interceptors/charset.interceptor';

import { getDatabaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PropertiesModule } from './properties/properties.module';
import { DemandeModule } from './contact/contact.module';
import { UploadModule } from './upload/upload.module';
import { BlogModule } from './blog/blog.module';
import { cloudinaryConfig } from './cloudinary/cloudinary.config';
import { LocationsModule } from './locations/locations.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { DbAutoMigrateService } from './config/db-auto-migrate.service';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { AgencesModule } from './agences/agences.module';
import { PromoteursModule } from './promoteurs/promoteurs.module';
import { ProjectsModule } from './projects/projects.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    CommonModule, // Global module for shared services
    // ✅ Load environment variables globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ✅ Redis Cache configuration with fallback
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService): Promise<any> => {
        const host = configService.get('REDIS_HOST') || 'localhost';
        const port = configService.get('REDIS_PORT') || 6379;
        const password = configService.get('REDIS_PASSWORD') || undefined;
    
        console.log('🔧 Configuring cache...');
        console.log(`🧠 Redis config -> Host: ${host}, Port: ${port}`);
    
        try {
          const store = await redisStore({
            socket: { host, port },
            password,
            ttl: 300, // 5 minutes
          });
    
          console.log('✅ Redis cache connected successfully!');
          return {
            store,
            isGlobal: true,
          };
        } catch (error) {
          console.warn('❌ Redis connection failed, using in-memory cache instead:', error.message);
          return {
            ttl: 300,
            max: 1000,
            isGlobal: true,
          };
        }
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
    
    

    // ✅ Rate limiting (Throttle)
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
      {
        ttl: 3600000, // 1 hour
        limit: 1000, // 1000 requests per hour
      },
    ]),

    // ✅ Database connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => getDatabaseConfig(configService),
      inject: [ConfigService],
    }),

    // ✅ Feature modules
    UsersModule,
    AuthModule,
    PropertiesModule,
    DemandeModule,
    UploadModule,
    BlogModule,
    LocationsModule,
    AnalyticsModule,
    SiteSettingsModule,
    AgencesModule,
    PromoteursModule,
    ProjectsModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    DbAutoMigrateService,

    // ✅ Global HTTP exception filter
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },

    // ✅ Smart Cache Interceptor (caches GET requests, respects @DisableCache decorator)
    {
      provide: APP_INTERCEPTOR,
      useClass: SmartCacheInterceptor,
    },
    
    // ✅ Cache Control Interceptor (handles cache headers)
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheControlInterceptor,
    },

    // ✅ Charset Interceptor (ensures utf-8 charset for emoji support)
    {
      provide: APP_INTERCEPTOR,
      useClass: CharsetInterceptor,
    },

    // ✅ Cloudinary config
    {
      provide: 'CLOUDINARY_CONFIG',
      useFactory: () => {
        cloudinaryConfig();
      },
    },
  ],
})
export class AppModule {}
