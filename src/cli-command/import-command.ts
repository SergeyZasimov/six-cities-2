import TSVFileReader from '../services/file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './cli-command.interface.js';
import { prepareToConsole } from '../utils/prepare-to-console.js';
import { ReadFileEvent } from '../types/read-file-events.enum.js';
import ConsoleLoggerService from '../services/logger/console-logger.service.js';
import OfferService from '../modules/offer/offer.service.js';
import { OfferModel } from '../modules/offer/offer.entity.js';
import { UserServiceInterface } from '../modules/user/user-service.interface.js';
import { OfferServiceInterface } from '../modules/offer/offer-sevice.interface.js';
import { DbConnectorInterface } from '../services/db-connector/db-connector.interface.js';
import { LoggerInterface } from '../services/logger/logger.interface.js';
import { UserModel } from '../modules/user/user.entity.js';
import UserService from '../modules/user/user.service.js';
import DbConnectorService from '../services/db-connector/db-connector.service.js';
import { ConfigInterface } from '../services/config/config.interface.js';
import ConfigService from '../services/config/config.service.js';
import { Offer } from '../types/offer.type.js';
import { AppConfig } from '../types/config.enum.js';
import { getUri } from '../utils/get-uri.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userService!: UserServiceInterface;
  private offerService!: OfferServiceInterface;
  private dbConnectorService!: DbConnectorInterface;
  private logger!: LoggerInterface;
  private config!: ConfigInterface;
  private salt!: string;

  constructor() {
    this.onCompleteRow = this.onCompleteRow.bind(this);
    this.onReadEnd = this.onReadEnd.bind(this);

    this.logger = new ConsoleLoggerService();
    this.config = new ConfigService(this.logger);
    this.offerService = new OfferService(this.logger, OfferModel);
    this.userService = new UserService(this.logger, UserModel, this.config);
    this.dbConnectorService = new DbConnectorService(this.logger);

    this.salt = this.config.get(AppConfig.SALT);
  }

  private async saveOffer( offer: Offer ) {
    const user = await this.userService.findOrCreate({
      ...offer.host,
      password: 'secret',
    }, this.salt);

    await this.offerService.create({
      ...offer,
      host: user.id,
    });
  }

  private async onCompleteRow( row: string, resolve: () => void ): Promise<void> {
    const offer = prepareToConsole(row);
    await this.saveOffer(offer);
    resolve();
  }

  private onReadEnd( count: number ) {
    console.log(`${count} row imported`);
    this.dbConnectorService.disconnect();
  }

  public async execute( filePath: string, login: string, password: string, host: string, port: number, dbname: string ): Promise<void> {
    const uri = getUri(login, password, host, port, dbname);
    await this.dbConnectorService.connect(uri);


    const fileReader = new TSVFileReader(filePath.trim());
    fileReader.on(ReadFileEvent.COMPLETE_ROW, this.onCompleteRow);
    fileReader.on(ReadFileEvent.READ_END, this.onReadEnd);

    try {
      await fileReader.read();
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Не удалось импортировать данные из файла по причине: «${err.message}»`);
      }
    }
  }
}
