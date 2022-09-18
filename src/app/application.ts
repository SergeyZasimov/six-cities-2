import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../services/logger/logger.interface.js';
import { ConfigInterface } from '../services/config/config.interface.js';
import { Component } from '../types/component.types.js';

@injectable()
export default class Application {

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface ) {
  }

  public async init() {
    this.logger.info('App initialization...');
    this.logger.info(`Get value from .env PORT: ${this.config.get('PORT')}`);
  }
}
