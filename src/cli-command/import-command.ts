import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './cli-command.interface.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  public execute(filename: string): void {
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(fileReader.prepareToConsole());
    } catch (err) {
      if (err instanceof Error) {
        console.error(
          `Не удалось импортировать данные из файла по причине: «${err.message}»`,
        );
      }
    }
  }
}
