import TSVFileReader from '../services/file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './cli-command.interface.js';
import { prepareToConsole } from '../utils/prepare-to-console.js';
import { ReadFileEvent } from '../types/read-file-events.enum.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  public async execute(filePath: string): Promise<void> {
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

  private onCompleteRow(row: string) {
    const offer = prepareToConsole(row);
    console.log(offer);
  }

  private onReadEnd(count: number) {
    console.log(`Импортировано ${count} строк`);
  }
}
