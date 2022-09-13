export interface FileWriterInterface {
  readonly filePath: string;
  write(row: string): void;
}
