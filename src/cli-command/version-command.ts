import { readFileSync } from 'fs';
import { CliCommandInterface } from './cli-command.interface.js';

export default class VersionCommand implements CliCommandInterface {
  public readonly name = '--version';

  public execute(): void {
    const version = this.getVersion();
    console.log(version);
  }

  private getVersion(): string {
    const packageContent = readFileSync('./package.json', 'utf-8');
    const packageParams = JSON.parse(packageContent);
    return packageParams.version;
  }
}
