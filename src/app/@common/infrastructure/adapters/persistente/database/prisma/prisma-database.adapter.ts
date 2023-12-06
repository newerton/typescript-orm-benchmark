import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import { DATABASE_URL } from '@app/@common/application/config';
import { DatabaseServerConfig } from '@core/@shared/infrastructure/config/env';

@Injectable()
export class PrismaDatabaseAdapter
  extends PrismaClient<
    Prisma.PrismaClientOptions,
    'query' | 'info' | 'warn' | 'error'
  >
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaDatabaseAdapter.name);

  constructor() {
    const optionsSuper: Prisma.PrismaClientOptions = {
      log: [],
      errorFormat: 'minimal',
      datasources: {
        db: {
          url: DATABASE_URL,
        },
      },
    };

    if (DatabaseServerConfig.LOGGING) {
      optionsSuper.log = [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ];
      optionsSuper.errorFormat = 'pretty';
    }

    super(optionsSuper);
  }

  async onModuleInit() {
    if (DatabaseServerConfig.LOGGING) {
      this.$on('query', (event) => {
        this.logger.verbose(
          `[${event.target}] ${event.query} ${event.params} ${event.duration}ms`,
        );
      });
      this.$on('error', (event) => {
        this.logger.error(`[${event.target}] ${event.message}`);
      });
      this.$on('info', (event) => {
        this.logger.log(`[${event.target}] ${event.message}`);
      });
      this.$on('warn', (event) => {
        this.logger.warn(`[${event.target}] ${event.message}`);
      });
    }

    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
