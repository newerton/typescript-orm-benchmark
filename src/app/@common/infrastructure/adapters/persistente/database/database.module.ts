import { Module } from '@nestjs/common';

import { drizzleDatabaseAdapter } from './drizzle';
import { PrismaDatabaseAdapter } from './prisma';

@Module({
  providers: [PrismaDatabaseAdapter, ...drizzleDatabaseAdapter],
  exports: [PrismaDatabaseAdapter, ...drizzleDatabaseAdapter],
})
export class DatabaseModule {}
