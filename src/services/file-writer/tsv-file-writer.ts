import { createWriteStream, WriteStream } from 'fs';
import { FileWriterInterface } from './file-writer.interface.js';

export default class TSVFileWriter implements FileWriterInterface {
  private stream: WriteStream;

  constructor(public readonly filePath: string) {
    this.stream = createWriteStream(this.filePath, {
      flags: 'w',
      encoding: 'utf-8',
      highWaterMark: 64 * 1024,
      autoClose: true,
    });
  }

  public async write(row: string): Promise<void> {
    const isSuccessfullyRecorded = this.stream.write(`${row}\n`);
    if (!isSuccessfullyRecorded) {
      return new Promise((resolve) => {
        this.stream.once('drain', () => resolve());
      });
    }
    return Promise.resolve();
  }
}
