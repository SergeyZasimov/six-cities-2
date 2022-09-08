export interface FileReaderInterface {
  readonly filePath: string;
  read(): void;
}
