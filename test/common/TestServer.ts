import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';

import { MainModule } from '../../src/main.module';

export class TestServer {
  constructor(
    public readonly serverApplication: NestExpressApplication,
    public readonly testingModule: TestingModule,
  ) {}

  public static async new(): Promise<TestServer> {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [MainModule],
    }).compile();

    const serverApplication: NestExpressApplication =
      testingModule.createNestApplication();

    return new TestServer(serverApplication, testingModule);
  }
}
