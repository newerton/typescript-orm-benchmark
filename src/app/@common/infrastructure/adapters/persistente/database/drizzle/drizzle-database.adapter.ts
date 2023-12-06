import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

import { DatabaseServerConfig } from '@core/@shared/infrastructure/config/env';

@Injectable()
export class DrizzleDatabaseAdapter implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DrizzleDatabaseAdapter.name);
  private client: Client;

  constructor() {}

  async onModuleInit() {
    this.client = new Client({
      host: DatabaseServerConfig.HOST,
      port: DatabaseServerConfig.PORT,
      user: DatabaseServerConfig.USER,
      password: DatabaseServerConfig.PASSWORD,
      database: DatabaseServerConfig.DATABASE,
    });

    await this.client.connect();

    return drizzle(this.client);
  }

  async onModuleDestroy() {
    await this.client.end();
  }
}
