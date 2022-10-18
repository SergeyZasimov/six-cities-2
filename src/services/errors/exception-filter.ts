import { ExceptionFilterInterface } from './exception-filter.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import HttpError from './http-error.js';
import { createErrorObject } from '../../utils/create-error-object.js';
import { AppError } from '../../types/app-error.enum.js';
import ValidationError from './validation-error.js';

@injectable()
export default class ExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
  ) {
    this.logger.info('Register ExceptionFilter');
  }

  private handleHttpError( error: HttpError, _req: Request, res: Response, _next: NextFunction ) {
    this.logger.error(`[${error.detail}]: ${error.httpStatusCode} - ${error.message}`);
    res
      .status(error.httpStatusCode)
      .json(createErrorObject(AppError.HttpError, error.message));
  }

  private handleOtherError( error: Error, _req: Request, res: Response, _next: NextFunction ) {
    this.logger.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createErrorObject(AppError.ServiceError, error.message));
  }

  private handleValidationError( error: ValidationError, _req: Request, res: Response, _next: NextFunction ) {
    this.logger.error(`[Validation Error]: ${error.message}`);
    error.details.forEach(
      ( errorField ) => this.logger.error(`[${errorField.property}] - ${errorField.messages}`),
    );
    res
      .status(error.httpStatusCode)
      .json(createErrorObject(AppError.ValidationError, error.message, error.details));
  }

  public catch( error: Error | HttpError | ValidationError, req: Request, res: Response, next: NextFunction ) {
    if (error instanceof HttpError) {
      return this.handleHttpError(error, req, res, next);
    } else if (error instanceof ValidationError) {
      return this.handleValidationError(error, req, res, next);
    }
    this.handleOtherError(error, req, res, next);
  }
}
