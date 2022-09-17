import { LoggerInterface } from '../services/logger/logger.interface.js';
import { ConfigInterface } from '../services/config/config.interface.js';

export default class Application {
  private logger!: LoggerInterface;
  private config!: ConfigInterface;

  constructor( logger: LoggerInterface, config: ConfigInterface ) {
    this.logger = logger;
    this.config = config;
  }

  public async init() {
    this.logger.info('App initialization...');
    this.logger.info(`Get value from .env PORT: ${this.config.get('PORT')}`);
  }
}
