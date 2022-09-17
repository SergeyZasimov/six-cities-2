import LoggerService from './services/logger/logger.service.js';
import Application from './app/application.js';


const logger = new LoggerService();

const app = new Application(logger);
await app.init();
