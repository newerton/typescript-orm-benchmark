import { Module } from '@nestjs/common';

import { PrismaDatabaseAdapter } from './prisma';

@Module({
  providers: [PrismaDatabaseAdapter],
  exports: [PrismaDatabaseAdapter],
})
export class DatabaseModule {}
