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
import { UserServiceInterface } from './modules/user/user-service.interface.js';
import UserService from './modules/user/user.service.js';
import { OfferServiceInterface } from './modules/offer/offer-sevice.interface.js';
import OfferService from './modules/offer/offer.service.js';
import { types } from '@typegoose/typegoose';
import { UserEntity, UserModel } from './modules/user/user.entity.js';
import { OfferEntity, OfferModel } from './modules/offer/offer.entity.js';
import { CommentServiceInterface } from './modules/comment/comment-service.interface.js';
import CommentService from './modules/comment/comment.service.js';
import { CommentEntity, CommentModel } from './modules/comment/comment.entity.js';
import { ControllerInterface } from './services/controller/controller.interface.js';
import OfferController from './modules/offer/offer.controller.js';
import ExceptionFilter from './services/errors/exception-filter.js';
import { ExceptionFilterInterface } from './services/errors/exception-filter.interface.js';
import UserController from './modules/user/user.controller.js';

const appContainer = new Container();
appContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
appContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
appContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();
appContainer.bind<DbConnectorInterface>(Component.DbConnectorInterface).to(DbConnectorService).inSingletonScope();
appContainer.bind<UserServiceInterface>(Component.UserServiceInterface).to(UserService);
appContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
appContainer.bind<OfferServiceInterface>(Component.OfferServiceInterface).to(OfferService);
appContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
appContainer.bind<CommentServiceInterface>(Component.CommentServiceInterface).to(CommentService);
appContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);

appContainer.bind<ExceptionFilterInterface>(Component.ExceptionFilterInterface).to(ExceptionFilter).inSingletonScope();

appContainer.bind<ControllerInterface>(Component.OfferController).to(OfferController).inSingletonScope();
appContainer.bind<ControllerInterface>(Component.UserController).to(UserController).inSingletonScope();

const app = appContainer.get<Application>(Component.Application);
await app.init();
