import { readFileSync } from 'fs';
import path from 'path';
import FileReadError from '../errors/file-reader-error.js';
import { CliCommandInterface } from './cli-command.interface.js';

export default class VersionCommand implements CliCommandInterface {
  private readonly packagePath = path.join('.', 'package.json');
  public readonly name = '--version';

  private getVersion(): string {
    try {
      const packageContent = readFileSync(this.packagePath, 'utf-8');
      const packageParams = JSON.parse(packageContent);
      return packageParams.version;
    } catch (err) {
      throw new FileReadError(this.packagePath);
    }
  }

  public execute(): void {
    try {
      const version = this.getVersion();
      console.log(version);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  }
}
