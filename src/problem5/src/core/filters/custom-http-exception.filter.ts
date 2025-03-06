/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';

@Catch(HttpException)
export class CustomHttpExceptionFilter implements ExceptionFilter {
  private logger: Logger;

  private logging: any;

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {
    this.logger = new Logger(CustomHttpExceptionFilter.name);
  }

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const context = host.switchToHttp();

    const request = context.getRequest<Request>();
    const body = request.body || {};

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const bodyReq = Object.assign(
      {},
      Object.keys(body).length ? body : request.query,
    );

    this.logging = {
      method: request.method.toUpperCase(),
      url: request.url,
      path: request.path,
      body: {
        protocol: request.protocol,
        header: request.headers,
        bodyReq,
      },
      response: {
        statusCode: statusCode,
        message: exception.message,
        name: exception.name,
        stacks: exception.stack,
      },
      timestamp: Date.now(),
    };

    if (!(exception instanceof HttpException)) {
      this.writeLog();
    }

    const errorBody = this.getData(exception);
    let errorMessage = errorBody?.message || exception?.message;
    if (!errorMessage) {
      errorMessage = 'Server Error';
    }

    httpAdapter.reply(
      context.getResponse(),
      {
        success: false,
        statusCode,
        message: errorMessage,
        data: errorBody?.details ? errorBody : errorBody?.data,
      },
      statusCode,
    );
  }

  getData(exception: any): any {
    if ('getResponse' in exception) {
      return exception.getResponse();
    }

    return null;
  }

  writeLog(): void {
    this.logger.error(
      `[${this.logging.ip}] ${this.logging.method} ${this.logging.url} (${Date.now() - this.logging.timestamp}ms) - ${JSON.stringify(this.logging.body)} - ${JSON.stringify(this.logging.response)}`,
    );
  }
}
