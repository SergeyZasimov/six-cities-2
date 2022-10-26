import chalk from 'chalk';
import { CliCommandInterface } from './cli-command.interface.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public execute(): void {
    console.log(
      chalk.underline(' Программа для подготовки данных для REST API сервера.'),
    );

    console.log(
      chalk.green(`
    Пример:
        main.js --<command> [--arguments]
    `),
    );

    console.log(
      chalk.italic(`
    Команды:
        --version:                                                  # выводит номер версии
        --help:                                                     # печатает этот текст
        --import <path> <login> <password> <host> <port> <dbName>:  # импортирует данные из TSV в базу данных
        --generate <count> <path> <url>                             # генерирует данные, в количестве <count>, принятые с сервера <url>
                                                                    # и записывает в файл <path>
    `),
    );
  }
}
