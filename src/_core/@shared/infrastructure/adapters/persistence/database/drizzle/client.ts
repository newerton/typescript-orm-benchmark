import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { DatabaseServerConfig } from '@core/@shared/infrastructure/config/env';

import * as schemas from './schemas';

export const drizzleClient = () => {
  return new Pool({
    host: DatabaseServerConfig.HOST,
    port: DatabaseServerConfig.PORT,
    user: DatabaseServerConfig.USER,
    password: DatabaseServerConfig.PASSWORD,
    database: DatabaseServerConfig.DATABASE,
  });
};

export const drizzleDatabaseAdapter = async (client: Pool) => {
  return drizzle(client, { schema: schemas });
};
