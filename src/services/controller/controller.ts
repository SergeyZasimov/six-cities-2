import { Response, Router } from 'express';
import { LoggerInterface } from '../logger/logger.interface.js';
import { ControllerInterface } from './controller.interface.js';
import { StatusCodes } from 'http-status-codes';
import { RouteInterface } from '../../types/route.interface.js';
import { injectable } from 'inversify';
import asyncHandler from 'express-async-handler';

@injectable()
export abstract class Controller implements ControllerInterface {
  private readonly _router: Router;

  constructor(
    protected readonly logger: LoggerInterface,
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute( route: RouteInterface ) {
    this._router[route.method](route.path, asyncHandler(route.handler.bind(this)));
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>( res: Response, statusCode: number, data: T ): void {
    res
      .type('application/json')
      .status(statusCode)
      .json(data);
  }

  public ok<T>( res: Response, data: T ) {
    this.send(res, StatusCodes.OK, data);
  }

  public created<T>( res: Response, data: T ) {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>( res: Response, data: T ) {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public noAuth<T>( res: Response, data: T ) {
    this.send(res, StatusCodes.UNAUTHORIZED, data);
  }

  public notFound<T>( res: Response, data: T ) {
    this.send(res, StatusCodes.NOT_FOUND, data);
  }

}
