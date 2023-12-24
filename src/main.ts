import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { applySwagger } from '@app/@common/application/config';
import { ApiServerConfig } from '@core/@shared/infrastructure/config/env';

import { MainModule } from './main.module';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    MainModule,
    new FastifyAdapter(),
  );

  app.enableShutdownHooks();

  applySwagger(app);

  await app.listen(ApiServerConfig.PORT).then(() => {
    logger.log(
      `🚀 orm-benchmark is running in http://localhost:${ApiServerConfig.PORT}`,
    );
  });
}
// MainService.clusterize(bootstrap);
bootstrap();
