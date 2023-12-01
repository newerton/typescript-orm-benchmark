import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule as NestJsTypeOrmModule } from '@nestjs/typeorm';

import {
  HttpExceptionFilter,
  ZodValidationExceptionFilter,
} from '@app/@common/application/exceptions/filter';
import { HttpLoggingInterceptor } from '@app/@common/application/interceptors';
import { dataSourceOptions } from '@app/@common/infrastructure/adapters/persistente/database/typeorm';
import { PrismaModule } from '@app/prisma/prisma.module';
import { TypeOrmModule } from '@app/typeorm/typeorm.module';
import { ApiServerConfig } from '@core/@shared/infrastructure/config/env';

import { MainController } from './main.controller';

const providers: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: ZodValidationExceptionFilter,
  },
];

if (ApiServerConfig.LOG_ENABLE) {
  providers.push({
    provide: APP_INTERCEPTOR,
    useClass: HttpLoggingInterceptor,
  });
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NestJsTypeOrmModule.forRoot(dataSourceOptions),
    PrismaModule,
    TypeOrmModule,
  ],
  controllers: [MainController],
  providers,
})
export class MainModule {}
