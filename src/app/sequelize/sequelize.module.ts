import { Module, Provider } from '@nestjs/common';
import {
  SequelizeModule as NestJsSequelizeModule,
  getModelToken,
} from '@nestjs/sequelize';

import { OrdersDITokens } from '@core/orders/domain/di';
import { SequelizeOrders } from '@core/orders/infrastructure/adapters/persistence/database/sequelize/entities';
import { OrdersSequelizeRepositoryAdapter } from '@core/orders/infrastructure/adapters/persistence/database/sequelize/repository';

import {
  CreateOrdersController,
  DeleteManyOrdersController,
  DeleteOrdersController,
  FullListOrdersController,
  GetOneOrdersController,
  ListAllOrdersController,
  UpdateOrdersController,
} from './controllers';
import {
  CreateOrdersUseCase,
  DeleteManyOrdersUseCase,
  DeleteOrdersUseCase,
  FullListOrdersUseCase,
  GetOneOrdersUseCase,
  ListAllOrdersUseCase,
  UpdateOrdersUseCase,
} from './use-cases';

const persistenceProviders: Provider[] = [
  {
    provide: OrdersDITokens.OrdersRepository,
    useFactory: () => {
      return new OrdersSequelizeRepositoryAdapter(SequelizeOrders);
    },
    inject: [getModelToken(SequelizeOrders)],
  },
];
const useCaseProviders: Provider[] = [
  CreateOrdersUseCase,
  DeleteOrdersUseCase,
  GetOneOrdersUseCase,
  ListAllOrdersUseCase,
  FullListOrdersUseCase,
  UpdateOrdersUseCase,
  DeleteManyOrdersUseCase,
];

@Module({
  imports: [NestJsSequelizeModule.forFeature([SequelizeOrders])],
  controllers: [
    CreateOrdersController,
    DeleteOrdersController,
    GetOneOrdersController,
    ListAllOrdersController,
    FullListOrdersController,
    UpdateOrdersController,
    DeleteManyOrdersController,
  ],
  providers: [...persistenceProviders, ...useCaseProviders],
  exports: [],
})
export class SequelizeModule {}
