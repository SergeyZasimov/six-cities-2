import { CliCommandInterface } from './cli-command.interface.js';
import { MockData } from '../types/mock-data.type.js';
import got from 'got';
import { appendFile } from 'fs/promises';
import OfferGenerator from '../common/offer-generator/offer-generator.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initData!: MockData;

  public async execute( ...parameters: string[] ): Promise<void> {
    const [count, filepath, url] = parameters;
    const offersCount = parseInt(count, 10);

    try {
      this.initData = await got.get(url).json();
    } catch (err) {
      console.log(`Невозможно получить данные от ${url}`);
    }

    const offerGeneratorString = new OfferGenerator(this.initData);

    const appendPromises = Array.from({ length: offersCount }, () => {
      appendFile(filepath, `${offerGeneratorString.generate()}\n`, 'utf-8');
    });

    Promise.all(appendPromises)
      .then(() => {
        console.log(`Файл ${filepath} был создан!`);
      })
      .catch(( err ) => {
        console.log(`запись в файл остановлена по причине: ${err}`);
      });
  }
}
