import { DataSource, DataSourceOptions } from 'typeorm';

import { DatabaseServerConfig } from '@core/@shared/infrastructure/config/env';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: DatabaseServerConfig.HOST,
  port: +DatabaseServerConfig.PORT,
  username: DatabaseServerConfig.USER,
  password: DatabaseServerConfig.PASSWORD,
  database: DatabaseServerConfig.DATABASE,
  entities: ['dist/**/entities/*{.ts,.js}'],
};

export const dataSource = new DataSource(dataSourceOptions);
