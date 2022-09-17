import LoggerService from './services/logger/logger.service.js';
import Application from './app/application.js';
import ConfigService from './services/config/config.service.js';


const logger = new LoggerService();
const config = new ConfigService(logger);

const app = new Application(logger, config);
await app.init();
