import { ExceptionFilterInterface } from './exception-filter.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

@injectable()
export default class ExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
  ) {
    this.logger.info('Register ExceptionFilter');
  }

  public catch( error: Error, _req: Request, res: Response, _next: NextFunction ) {
    this.logger.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}
