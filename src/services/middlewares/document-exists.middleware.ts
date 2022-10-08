import { MiddlewareInterface } from '../../types/middleware.interface.js';
import { DocumentExistsInterface } from '../../types/document-exists.interface.js';
import { NextFunction, Request, Response } from 'express';
import HttpError from '../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';

export class DocumentExistsMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: DocumentExistsInterface,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {
  }

  public async execute( req: Request, _res: Response, next: NextFunction ) {
    const { params } = req;
    const documentId = params[this.paramName];
    if (!await this.service.exists(documentId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ID:${documentId} not found`,
        'DocumentExistsMiddleware',
      );
    }
    next();
  }
}
