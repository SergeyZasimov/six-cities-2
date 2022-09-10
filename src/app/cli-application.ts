import { CliCommandInterface } from '../cli-command/cli-command.interface.js';

type CommandsMap = {
  [commandName: string]: CliCommandInterface;
};

type ParsedCommand = {
  [command: string]: string[];
};

export default class CliApplication {
  private commands: CommandsMap = {};
  private defaultCommand = '--help';

  private parseCommandLine(commandLineArguments: string[]): ParsedCommand {
    const parsedCommand: ParsedCommand = {};
    let command: string;

    return commandLineArguments.reduce((acc, currItem) => {
      if (currItem.startsWith('--')) {
        acc[currItem] = [];
        command = currItem;
      } else if (command && currItem) {
        acc[command].push(currItem);
      }
      return acc;
    }, parsedCommand);
  }

  private getCommand(commandName: string): CliCommandInterface {
    return this.commands[commandName] ?? this.commands[this.defaultCommand];
  }

  public registerCommand(commandList: CliCommandInterface[]): void {
    commandList.reduce((acc, currCommand) => {
      acc[currCommand.name] = currCommand;
      return acc;
    }, this.commands);
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = this.parseCommandLine(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);
  }
}
