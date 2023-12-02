import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Dialect, Sequelize } from 'sequelize';

import { DatabaseServerConfig } from '@core/@shared/infrastructure/config/env';
import { SequelizeOrders } from '@core/orders/infrastructure/adapters/persistence/database/sequelize/entities';

export const sequelizeOptions: SequelizeModuleOptions = {
  dialect: DatabaseServerConfig.DIALECT as Dialect,
  host: DatabaseServerConfig.HOST,
  port: +DatabaseServerConfig.PORT,
  username: DatabaseServerConfig.USER,
  password: DatabaseServerConfig.PASSWORD,
  database: DatabaseServerConfig.DATABASE,
  logging: DatabaseServerConfig.LOGGING,
  models: [SequelizeOrders],
};

export const sequelizeDataSource = new Sequelize(sequelizeOptions);
