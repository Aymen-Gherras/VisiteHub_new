import { randomUUID, webcrypto } from 'crypto';

// ✅ Ensure global crypto support (for TypeORM + Node 18+)
if (!(global as any).crypto) {
  (global as any).crypto = webcrypto as any;
  (global as any).crypto.randomUUID = randomUUID;
}

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Trust reverse proxies (for correct req.protocol behind HTTPS/load balancers)
  app.set('trust proxy', 1);

  // Serve locally uploaded files
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  // ✅ SECURITY: Validate required environment variables
  const requiredVars = [
    'JWT_SECRET',
    'DB_PASSWORD',
    'DB_USERNAME',
    'DB_DATABASE',
  ];

  const missing = requiredVars.filter(
    (varName) => !configService.get(varName)
  );

  if (missing.length > 0) {
    console.error('❌ CRITICAL: Missing required environment variables:', missing.join(', '));
    console.error('Please set these variables in your .env file before starting the application.');
    process.exit(1);
  }

  // ✅ Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  // ✅ SECURITY: CORS setup - only HTTPS in production
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  const allowedOrigins = isProduction
    ? [
        'https://visitehub.com',
        'https://www.visitehub.com',
        'https://visiteapihub.duckdns.org', // API domain itself
      ]
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'https://visitehub.com', // Allow production origin in dev for testing
        'https://www.visitehub.com',
      ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        callback(null, true);
        return;
      }
      
      // Normalize origin (remove trailing slash, convert to lowercase for comparison)
      const normalizedOrigin = origin.toLowerCase().replace(/\/$/, '');
      const normalizedAllowed = allowedOrigins.map(o => o.toLowerCase().replace(/\/$/, ''));
      
      if (normalizedAllowed.includes(normalizedOrigin)) {
        callback(null, true);
      } else {
        // Log for debugging (only in non-production to avoid spam)
        if (!isProduction) {
          console.warn(`CORS blocked origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
        }
        callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // ✅ Global API prefix
  app.setGlobalPrefix('api');

  // ✅ Global validation
  // DISABLED enableImplicitConversion to prevent "1 milliards" from being converted to number 1
  // Individual fields that need conversion use @Transform decorators explicitly
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { 
        enableImplicitConversion: false, // DISABLED to preserve price strings like "1 milliards"
        excludeExtraneousValues: false,
      },
    }),
  );

  // ✅ SECURITY: Swagger documentation - only in development
  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('Exped360 API')
      .setDescription('The Exped360 API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    console.log(`📘 Swagger docs: http://localhost:${configService.get<number>('PORT', 3002)}/docs`);
  }

  // ✅ SECURITY: Reduce console logging in production
  if (isProduction) {
    // Disable verbose logging in production
    const originalLog = console.log;
    const originalInfo = console.info;
    const originalDebug = console.debug;
    
    console.log = () => {};
    console.info = () => {};
    console.debug = () => {};
    
    // Keep error and warn for critical issues
    // console.error and console.warn remain active
  }

  // ✅ Start the server
  const port = configService.get<number>('PORT', 3002);
  await app.listen(port, '0.0.0.0');

  if (!isProduction) {
    console.log(`🚀 App running on: http://localhost:${port}`);
  } else {
    console.log(`🚀 App running on port ${port}`);
  }
}

bootstrap();
