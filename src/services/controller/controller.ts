import { Response, Router } from 'express';
import { LoggerInterface } from '../logger/logger.interface.js';
import { ControllerInterface } from './controller.interface.js';
import { StatusCodes } from 'http-status-codes';
import { RouteInterface } from '../../types/route.interface.js';
import { injectable } from 'inversify';
import asyncHandler from 'express-async-handler';
import { ConfigInterface } from '../config/config.interface.js';
import { getServerPath } from '../../utils/get-server-path.js';
import { AppConfig } from '../../types/config.enum.js';
import { transformImagePath } from '../../utils/transform-image-path.js';
import { UPLOAD_RESOURCE_FIELDS } from '../../app/application.constant.js';

@injectable()
export abstract class Controller implements ControllerInterface {
  private readonly _router: Router;

  constructor(
    protected readonly logger: LoggerInterface,
    protected readonly config: ConfigInterface,
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute( route: RouteInterface ) {
    const routeHandler = asyncHandler(route.handler.bind(this));
    const middlewares = route.middlewares?.map(
      ( middleware ) => asyncHandler(middleware.execute.bind(middleware)),
    );
    const handler = middlewares ? [...middlewares, routeHandler] : routeHandler;
    this._router[route.method](route.path, handler);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  protected addStaticPath( data: Record<string, unknown> ): void {
    const fullServerPath = getServerPath(this.config.get(AppConfig.HOST), this.config.get(AppConfig.PORT));
    transformImagePath(
      UPLOAD_RESOURCE_FIELDS,
      `${fullServerPath}/${this.config.get(AppConfig.STATIC_DIRECTORY)}`,
      `${fullServerPath}/${this.config.get(AppConfig.UPLOAD_DIRECTORY)}`,
      data,
    );
  }

  public send<T>( res: Response, statusCode: number, data?: T ): void {
    if (data) {
      this.addStaticPath(data as Record<string, unknown>);
    }
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

  public noContent( res: Response ) {
    this.send(res, StatusCodes.NO_CONTENT);
  }
}
