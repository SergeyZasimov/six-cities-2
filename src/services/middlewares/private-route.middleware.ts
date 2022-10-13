import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import HttpError from '../errors/http-error.js';

export default class PrivateRouteMiddleware implements MiddlewareInterface {
  public async execute(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'PrivateRouteMiddleware',
      );
    }
    return next();
  }
}
