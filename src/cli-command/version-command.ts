import { readFileSync } from 'fs';
import path from 'path';
import { CliCommandInterface } from './cli-command.interface.js';

export default class VersionCommand implements CliCommandInterface {
  private readonly packagePath = path.join('.', 'package.json');
  public readonly name = '--version';

  private getVersion(): string {
    const packageContent = readFileSync(this.packagePath, 'utf-8');
    const packageParams = JSON.parse(packageContent);
    return packageParams.version;
  }

  public execute(): void {
    const version = this.getVersion();
    console.log(version);
  }
}
