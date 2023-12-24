import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';

import { drizzleClient } from '@core/@shared/infrastructure/adapters/persistence/database/drizzle/client';
import * as schemas from '@core/@shared/infrastructure/adapters/persistence/database/drizzle/schemas';

export const drizzleDatabaseAdapter = [
  {
    provide: 'DRIZZLE_DATABASE_ADAPTER',
    useFactory: async (): Promise<NodePgDatabase<typeof schemas>> => {
      const client = drizzleClient();
      return drizzle(client, { schema: schemas });
    },
    exports: ['DRIZZLE_DATABASE_ADAPTER'],
  },
];
