import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../services/logger/logger.interface.js';
import { ConfigInterface } from '../services/config/config.interface.js';
import { Component } from '../types/component.types.js';
import { DbConnectorInterface } from '../services/db-connector/db-connector.interface.js';
import { getUri } from '../utils/get-uri.js';
import { DbConnection } from '../types/db-connection.enum.js';
import { AppConfig } from '../types/config.enum.js';

@injectable()
export default class Application {

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DbConnectorInterface) private dbClient: DbConnectorInterface ) {
  }

  public async init() {
    this.logger.info('App initialization...');
    this.logger.info(`Get value from .env PORT: ${this.config.get(AppConfig.PORT)}`);

    const uri = getUri(
      this.config.get(DbConnection.DB_USER),
      this.config.get(DbConnection.DB_PASSWORD),
      this.config.get(DbConnection.DB_HOST),
      this.config.get(DbConnection.DB_PORT),
      this.config.get(DbConnection.DB_NAME),
    );

    await this.dbClient.connect(uri);
  }
}
