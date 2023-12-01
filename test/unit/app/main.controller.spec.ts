import { Test, TestingModule } from '@nestjs/testing';

import { ApiServerConfig } from '@core/@shared/infrastructure/config/env';

import { MainController } from '../../../src/main.controller';

describe('MainController', () => {
  let controller: MainController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MainController],
    }).compile();

    controller = module.get<MainController>(MainController);
  });

  describe('execute', () => {
    it('should return status message', () => {
      const expectedResult = {
        status: `[${ApiServerConfig.ENV}] orm-benchmark está online`,
      };

      const result = controller.execute();

      expect(result).toEqual(expectedResult);
    });
  });
});
