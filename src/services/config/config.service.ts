import { ConfigInterface } from './config.interface.js';
import { config, DotenvParseOutput } from 'dotenv';
import { LoggerInterface } from '../logger/logger.interface.js';

export default class ConfigService implements ConfigInterface {
  private readonly config: DotenvParseOutput;
  private readonly logger: LoggerInterface;

  constructor( logger: LoggerInterface ) {
    this.logger = logger;
    const parsedOutput = config();
    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file. Perhaps file doesn\'t exist');
    }
    this.config = parsedOutput.parsed as DotenvParseOutput;
    this.logger.info('.env file found and successfully parsed!');
  }

  public get( key: string ): string | undefined {
    return this.config[key];
  }
}
