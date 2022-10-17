import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../services/logger/logger.interface.js';
import { ConfigInterface } from '../services/config/config.interface.js';
import { Component } from '../types/component.types.js';
import { DbConnectorInterface } from '../services/db-connector/db-connector.interface.js';
import { getUri } from '../utils/get-uri.js';
import { DbConnection } from '../types/db-connection.enum.js';
import { AppConfig } from '../types/config.enum.js';
import express, { Express } from 'express';
import { ControllerInterface } from '../services/controller/controller.interface.js';
import { ExceptionFilterInterface } from '../services/errors/exception-filter.interface.js';
import AuthenticateMiddleware from '../services/middlewares/authenticate.middleware.js';

@injectable()
export default class Application {
  private expressApp: Express;

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DbConnectorInterface)
    private dbClient: DbConnectorInterface,
    @inject(Component.ExceptionFilterInterface)
    private exceptionFilter: ExceptionFilterInterface,
    @inject(Component.OfferController)
    private offerController: ControllerInterface,
    @inject(Component.UserController)
    private userController: ControllerInterface,
    @inject(Component.CommentController)
    private commentController: ControllerInterface,
  ) {
    this.expressApp = express();
  }

  public registerRoutes() {
    this.expressApp.use('/offers', this.offerController.router);
    this.expressApp.use('/users', this.userController.router);
    this.expressApp.use('/comments', this.commentController.router);
  }

  public initMiddleware() {
    this.expressApp.use(express.json());
    this.expressApp.use('/upload', express.static(this.config.get(AppConfig.UPLOAD_DIRECTORY)));

    const authMiddleware = new AuthenticateMiddleware(this.config.get(AppConfig.JWT_SECRET));
    this.expressApp.use(authMiddleware.execute.bind(authMiddleware));
  }

  public initExceptionFilters() {
    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init() {
    this.logger.info('App initialization...');

    const uri = getUri(
      this.config.get(DbConnection.DB_USER),
      this.config.get(DbConnection.DB_PASSWORD),
      this.config.get(DbConnection.DB_HOST),
      this.config.get(DbConnection.DB_PORT),
      this.config.get(DbConnection.DB_NAME),
    );

    await this.dbClient.connect(uri);

    this.initMiddleware();
    this.registerRoutes();
    this.initExceptionFilters();

    this.expressApp.listen(this.config.get(AppConfig.PORT), () => {
      this.logger.info(`Server started on http://localhost:${this.config.get(AppConfig.PORT)}`);
    });
  }
}
