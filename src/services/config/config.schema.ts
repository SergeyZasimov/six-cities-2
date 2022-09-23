import convict from 'convict';
import validator from 'convict-format-with-validator';
import { DbConnection } from '../../types/db-connection.enum.js';
import { AppConfig } from '../../types/config.enum.js';

convict.addFormats(validator);

export type ConfigSchema = {
  [AppConfig.PORT]: number;
  [AppConfig.SALT]: string;
  [DbConnection.DB_HOST]: string;
  [DbConnection.DB_USER]: string;
  [DbConnection.DB_PASSWORD]: string;
  [DbConnection.DB_PORT]: number;
  [DbConnection.DB_NAME]: string;
}

export const configSchema = convict<ConfigSchema>({
  [AppConfig.PORT]: {
    doc: 'Port for incoming connection',
    format: 'port',
    env: AppConfig.PORT,
    default: 4455,
  },
  [AppConfig.SALT]: {
    doc: 'The string that is added when encrypting the password',
    format: String,
    env: AppConfig.SALT,
    default: null,
    sensitive: true,
  },
  [DbConnection.DB_HOST]: {
    doc: 'Data Base Server IP address',
    format: 'ipaddress',
    env: DbConnection.DB_HOST,
    default: '127.0.0.1',
  },
  [DbConnection.DB_USER]: {
    doc: 'Username to connect to DB',
    format: String,
    env: DbConnection.DB_USER,
    default: null,
  },
  [DbConnection.DB_PASSWORD]: {
    doc: 'Password to connect to DB',
    format: String,
    env: DbConnection.DB_PASSWORD,
    default: null,
  },
  [DbConnection.DB_PORT]: {
    doc: 'Port to connect to DB',
    format: Number,
    env: DbConnection.DB_PORT,
    default: null,
  },
  [DbConnection.DB_NAME]: {
    doc: 'DB name',
    format: String,
    env: DbConnection.DB_NAME,
    default: 'six-cities',
  },
});
