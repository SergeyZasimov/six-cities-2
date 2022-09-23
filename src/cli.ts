#!/usr/bin/env node
import 'reflect-metadata';
import CliApplication from './app/cli-application.js';
import HelpCommand from './cli-command/help-command.js';
import ImportCommand from './cli-command/import-command.js';
import VersionCommand from './cli-command/version-command.js';
import GenerateCommand from './cli-command/generate-command.js';

const cliManager = new CliApplication();
cliManager.registerCommand([
  new HelpCommand(),
  new VersionCommand(),
  new ImportCommand(),
  new GenerateCommand(),
]);

cliManager.processCommand(process.argv);
