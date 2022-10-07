import { ExceptionFilterInterface } from './exception-filter.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import HttpError from './http-error.js';
import { createErrorObject } from '../../utils/create-error-object.js';

@injectable()
export default class ExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
  ) {
    this.logger.info('Register ExceptionFilter');
  }

  private handleHttpError( error: HttpError, _req: Request, res: Response, _next: NextFunction ) {
    this.logger.error(error.message);
    res.status(error.httpStatusCode).json(createErrorObject(error.message));
  }

  private handleOtherError( error: Error, _req: Request, res: Response, _next: NextFunction ) {
    this.logger.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createErrorObject(error.message));
  }

  public catch( error: Error | HttpError, req: Request, res: Response, next: NextFunction ) {
    if (error instanceof HttpError) {
      this.handleHttpError(error, req, res, next);
      return;
    }
    this.handleOtherError(error, req, res, next);
  }
}
