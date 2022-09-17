import { FileReaderInterface } from './file-reader.interface.js';
import EventEmitter from 'events';
import { createReadStream, ReadStream } from 'fs';
import { ReadFileEvent } from '../../types/read-file-events.enum.js';

export default class TSVFileReader extends EventEmitter implements FileReaderInterface {
  private stream: ReadStream;

  constructor(public readonly filePath: string) {
    super();
    this.stream = createReadStream(this.filePath, {
      highWaterMark: 16 * 1024,
      encoding: 'utf-8',
    });
  }

  public async read(): Promise<void> {
    let readLine = '';
    let rowCount = 0;
    let endLinePosition = -1;

    for await (const chunk of this.stream) {
      readLine += chunk.toString();
      endLinePosition = readLine.indexOf('\n');

      while (endLinePosition >= 0) {
        const completeRow = readLine.slice(0, endLinePosition + 1);
        readLine = readLine.slice(++endLinePosition);
        rowCount++;
        this.emit(ReadFileEvent.COMPLETE_ROW, completeRow);
        endLinePosition = readLine.indexOf('\n');
      }
    }

    this.emit(ReadFileEvent.READ_END, rowCount);
  }
}
