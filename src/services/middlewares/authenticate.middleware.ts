import * as jose from 'jose';
import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import { createSecretKey } from 'crypto';
import HttpError from '../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';

export default class AuthenticateMiddleware implements MiddlewareInterface {
  constructor( private readonly secretJwt: string ) {
  }

  public async execute( req: Request, _res: Response, next: NextFunction ): Promise<void> {
    let token;
    if (req.headers.authorization) {
      const authHeader = req.headers.authorization.split(' ');
      token = authHeader[1];
    } else if (req.headers['x-token']) {
      token = req.headers['x-token'];
    } else {
      return next();
    }

    try {
      const { payload } = await jose.jwtVerify(token as string, createSecretKey(this.secretJwt, 'utf-8'));
      req.user = { email: payload.email as string, id: payload.id as string };
      return next();
    } catch {
      return next(new HttpError(StatusCodes.UNAUTHORIZED, 'Invalid token', 'AuthenticateMiddleware'));
    }
  }
}
