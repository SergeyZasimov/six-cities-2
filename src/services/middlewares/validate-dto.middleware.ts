import { MiddlewareInterface } from '../../types/middleware.interface.js';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';

export default class ValidateDtoMiddleware implements MiddlewareInterface {
  constructor( private dto: ClassConstructor<object> ) {
  }

  public async execute( req: Request, res: Response, next: NextFunction ) {
    const { body } = req;

    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).send(errors);
      return;
    }

    next();
  }
}
