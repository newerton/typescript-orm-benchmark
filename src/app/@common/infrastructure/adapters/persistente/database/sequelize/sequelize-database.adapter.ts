import path from 'node:path';

import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Dialect, Sequelize } from 'sequelize';

import { DatabaseServerConfig } from '@core/@shared/infrastructure/config/env';

const pathsModels = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  '..',
  '..',
  '..',
  '_core',
  '**',
  'infrastructure',
  '**',
  'sequelize',
  'entities',
  '*.entity.js',
);

export const sequelizeOptions: SequelizeModuleOptions = {
  dialect: DatabaseServerConfig.DIALECT as Dialect,
  host: DatabaseServerConfig.HOST,
  port: +DatabaseServerConfig.PORT,
  username: DatabaseServerConfig.USER,
  password: DatabaseServerConfig.PASSWORD,
  database: DatabaseServerConfig.DATABASE,
  logging: DatabaseServerConfig.LOGGING,
  models: [pathsModels],
  modelMatch: (filename, member) => {
    return (
      filename.substring(0, filename.indexOf('.entity')).toLowerCase() ===
      member.toLowerCase().replace('sequelize', '')
    );
  },
};

export const sequelizeDataSource = new Sequelize(sequelizeOptions);
