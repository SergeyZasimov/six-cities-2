import * as jose from 'jose';
import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import { createSecretKey } from 'crypto';
import HttpError from '../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';

export default class AuthenticateMiddleware implements MiddlewareInterface {
  constructor(private readonly secretJwt: string) {}

  public async execute(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const authHeader = req.headers?.authorization?.split(' ');

    if (!authHeader) {
      return next();
    }

    const [, token] = authHeader;

    try {
      const { payload } = await jose.jwtVerify(
        token,
        createSecretKey(this.secretJwt, 'utf-8'),
      );
      req.user = { email: payload.email as string, id: payload.id as string };
      return next();
    } catch {
      return next(
        new HttpError(
          StatusCodes.UNAUTHORIZED,
          'Invalid token',
          'AuthenticateMiddleware',
        ),
      );
    }
  }
}
