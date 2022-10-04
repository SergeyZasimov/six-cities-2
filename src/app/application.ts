import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../services/logger/logger.interface.js';
import { ConfigInterface } from '../services/config/config.interface.js';
import { Component } from '../types/component.types.js';
import { DbConnectorInterface } from '../services/db-connector/db-connector.interface.js';
import { getUri } from '../utils/get-uri.js';
import { DbConnection } from '../types/db-connection.enum.js';
import { AppConfig } from '../types/config.enum.js';
import express, { Express } from 'express';

@injectable()
export default class Application {
  private expressApp: Express;

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DbConnectorInterface) private dbClient: DbConnectorInterface,
  ) {
    this.expressApp = express();
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

    this.expressApp.listen(this.config.get(AppConfig.PORT), () => {
      this.logger.info(`Server started on http://localhost:${this.config.get(AppConfig.PORT)}`);
    });

  }
}
