#!/usr/bin/env node

import CliApplication from './app/cli-application.js';
import HelpCommand from './cli-command/help-command.js';
import ImportCommand from './cli-command/import -command.js';
import VersionCommand from './cli-command/version-command.js';

const cliManager = new CliApplication();
cliManager.registerCommand([
  new HelpCommand(),
  new VersionCommand(),
  new ImportCommand(),
]);

cliManager.processCommand(process.argv);
