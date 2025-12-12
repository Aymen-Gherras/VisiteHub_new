import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  // Prefer explicit DB_TYPE. Default to MySQL for VPS deployments.
  const dbType = configService.get<string>('DB_TYPE', 'mysql');

  if (dbType === 'mysql') {
    // ✅ SECURITY: Require DB_PASSWORD - no hardcoded defaults
    const dbPassword = configService.get<string>('DB_PASSWORD');
    if (!dbPassword) {
      throw new Error('DB_PASSWORD environment variable is required. Please set it in your .env file.');
    }
    
    const dbUsername = configService.get<string>('DB_USERNAME');
    if (!dbUsername) {
      throw new Error('DB_USERNAME environment variable is required. Please set it in your .env file.');
    }

    return {
      type: 'mysql',
      host: configService.get<string>('DB_HOST', 'localhost'),
      port: configService.get<number>('DB_PORT', 3306),
      username: dbUsername,
      password: dbPassword, // ✅ No default - must be in env
      database: configService.get<string>('DB_DATABASE', 'exped360-db'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false, // ❌ NEVER use synchronize - use migrations or DbAutoMigrateService instead
      logging: configService.get<string>('NODE_ENV') !== 'production',
      timezone: 'Z',
      charset: 'utf8mb4',
      // ✅ Connection pooling for better performance (MySQL2 valid options only)
      extra: {
        connectionLimit: 10,
      },
    };
  }

  // Only honor DATABASE_URL when DB_TYPE is explicitly set to 'postgres'.
  if (dbType === 'postgres') {
    const databaseUrl = configService.get<string>('DATABASE_URL');
    if (databaseUrl) {
      const url = new URL(databaseUrl);
      return {
        type: 'postgres',
        host: url.hostname,
        port: parseInt(url.port, 10),
        username: url.username,
        password: url.password,
        database: url.pathname.substring(1),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false, // ❌ NEVER use synchronize - use migrations or DbAutoMigrateService instead
        logging: configService.get<string>('NODE_ENV') !== 'production',
        // ✅ SECURITY: Proper SSL configuration
        ssl: process.env.NODE_ENV === 'production' 
          ? {
              rejectUnauthorized: true, // ✅ Require valid SSL certificate
              // If you have a CA certificate, uncomment and set DB_CA_CERT_PATH
              // ca: process.env.DB_CA_CERT_PATH ? require('fs').readFileSync(process.env.DB_CA_CERT_PATH) : undefined,
            }
          : false, // Allow self-signed certs in development
        // ✅ Connection pooling for better performance (PostgreSQL uses different options)
        extra: {
          max: 10,
        },
      };
    }

    // Fallback to discrete PG env vars
    // ✅ SECURITY: Require DB_PASSWORD - no hardcoded defaults
    const dbPassword = configService.get<string>('DB_PASSWORD');
    if (!dbPassword) {
      throw new Error('DB_PASSWORD environment variable is required. Please set it in your .env file.');
    }
    
    const dbUsername = configService.get<string>('DB_USERNAME');
    if (!dbUsername) {
      throw new Error('DB_USERNAME environment variable is required. Please set it in your .env file.');
    }

    return {
      type: 'postgres',
      host: configService.get<string>('DB_HOST', 'localhost'),
      port: configService.get<number>('DB_PORT', 5432),
      username: dbUsername,
      password: dbPassword, // ✅ No default - must be in env
      database: configService.get<string>('DB_DATABASE', 'exped360'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false, // ❌ NEVER use synchronize - use migrations or DbAutoMigrateService instead
      logging: configService.get<string>('NODE_ENV') !== 'production',
      // ✅ Connection pooling for better performance (PostgreSQL uses different options)
      extra: {
        max: 10,
      },
    };
  }

  // Default safe fallback remains MySQL
  // ✅ SECURITY: Require DB_PASSWORD - no hardcoded defaults
  const dbPassword = configService.get<string>('DB_PASSWORD');
  if (!dbPassword) {
    throw new Error('DB_PASSWORD environment variable is required. Please set it in your .env file.');
  }
  
  const dbUsername = configService.get<string>('DB_USERNAME');
  if (!dbUsername) {
    throw new Error('DB_USERNAME environment variable is required. Please set it in your .env file.');
  }

  return {
    type: 'mysql',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 3306),
    username: dbUsername,
    password: dbPassword, // ✅ No default - must be in env
    database: configService.get<string>('DB_DATABASE', 'exped360'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false, // ❌ NEVER use synchronize - use migrations or DbAutoMigrateService instead
    logging: configService.get<string>('NODE_ENV') !== 'production',
    timezone: 'Z',
    charset: 'utf8mb4',
    // ✅ Connection pooling for better performance (MySQL2 valid options only)
    extra: {
      connectionLimit: 10,
    },
  };
};