import 'reflect-metadata';
import LoggerService from './services/logger/logger.service.js';
import Application from './app/application.js';
import ConfigService from './services/config/config.service.js';
import { Container } from 'inversify';
import { Component } from './types/component.types.js';
import { LoggerInterface } from './services/logger/logger.interface.js';
import { ConfigInterface } from './services/config/config.interface.js';
import { DbConnectorInterface } from './services/db-connector/db-connector.interface.js';
import DbConnectorService from './services/db-connector/db-connector.service.js';

const appContainer = new Container();
appContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
appContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
appContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();
appContainer.bind<DbConnectorInterface>(Component.DbConnectorInterface).to(DbConnectorService).inSingletonScope();

const app = appContainer.get<Application>(Component.Application);
await app.init();
