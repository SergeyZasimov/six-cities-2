import { CliCommandInterface } from './cli-command.interface.js';
import { MockData } from '../types/mock-data.type.js';
import got from 'got';
import OfferGenerator from '../services/offer-generator/offer-generator.js';
import TSVFileWriter from '../services/file-writer/tsv-file-writer.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initData!: MockData;

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filePath, url] = parameters;
    const offersCount = parseInt(count, 10);

    try {
      this.initData = await got.get(url).json();
    } catch (err) {
      console.log(`Невозможно получить данные от ${url}`);
    }

    const offerGeneratorString = new OfferGenerator(this.initData);
    const tsvFileWriter = new TSVFileWriter(filePath);

    const appendPromises = Array.from({ length: offersCount }, () => {
      const row = offerGeneratorString.generate();
      tsvFileWriter.write(row);
    });

    Promise.all(appendPromises)
      .then(() => {
        console.log(`Файл ${filePath} был записан!`);
      })
      .catch((err) => {
        console.log(`запись в файл остановлена по причине: ${err}`);
      });
  }
}
