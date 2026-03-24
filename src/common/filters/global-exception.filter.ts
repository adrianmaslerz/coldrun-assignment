import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainException } from '../../trucks/domain/exceptions';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { url } = ctx.getRequest<Request>();
    const timestamp = new Date().toISOString();

    if (exception instanceof DomainException) {
      response.status(exception.httpStatus).json({
        statusCode: exception.httpStatus,
        error: HttpStatus[exception.httpStatus],
        message: exception.message,
        code: exception.code,
        timestamp,
        path: url,
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      const message =
        typeof res === 'object' && res !== null && 'message' in res
          ? (res as Record<string, unknown>).message
          : exception.message;

      response.status(status).json({
        statusCode: status,
        error: HttpStatus[status],
        message,
        timestamp,
        path: url,
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      timestamp,
      path: url,
    });
  }
}
