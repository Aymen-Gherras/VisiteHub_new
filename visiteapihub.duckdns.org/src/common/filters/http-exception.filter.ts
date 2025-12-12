import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : (exceptionResponse as any).message || exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Unexpected error: ${exception.message}`, exception.stack);
    }

    // Log the error with full details (including stack trace for debugging)
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );
    
    // Log full error object for database/TypeORM errors
    if (exception instanceof Error && (exception as any).code) {
      this.logger.error(`Database error code: ${(exception as any).code}`);
      this.logger.error(`SQL error: ${(exception as any).sqlMessage || (exception as any).sql || 'N/A'}`);
    }

    // Prevent sensitive information leakage
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      message = 'Something went wrong. Please try again later.';
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
