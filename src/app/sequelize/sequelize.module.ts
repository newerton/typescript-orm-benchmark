import { Module, Provider } from '@nestjs/common';
import {
  SequelizeModule as NestJsSequelizeModule,
  getModelToken,
} from '@nestjs/sequelize';

import { ItemsDITokens } from '@core/items/domain/di';
import { SequelizeItems } from '@core/items/infrastructure/adapters/persistence/database/sequelize/entities';
import { ItemsSequelizeRepositoryAdapter } from '@core/items/infrastructure/adapters/persistence/database/sequelize/repository';
import { OrdersDITokens } from '@core/orders/domain/di';
import { SequelizeOrders } from '@core/orders/infrastructure/adapters/persistence/database/sequelize/entities';
import { OrdersSequelizeRepositoryAdapter } from '@core/orders/infrastructure/adapters/persistence/database/sequelize/repository';
import { OrdersItemsDITokens } from '@core/orders_items/domain/di';
import { SequelizeOrdersItems } from '@core/orders_items/infrastructure/adapters/persistence/database/sequelize/entities';
import { OrdersItemsSequelizeRepositoryAdapter } from '@core/orders_items/infrastructure/adapters/persistence/database/sequelize/repository';

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
    useFactory: (model) => {
      return new OrdersSequelizeRepositoryAdapter(model);
    },
    inject: [getModelToken(SequelizeOrders)],
  },
  {
    provide: ItemsDITokens.ItemsRepository,
    useFactory: (model) => {
      return new ItemsSequelizeRepositoryAdapter(model);
    },
    inject: [getModelToken(SequelizeItems)],
  },
  {
    provide: OrdersItemsDITokens.OrdersItemsRepository,
    useFactory: (model) => {
      return new OrdersItemsSequelizeRepositoryAdapter(model);
    },
    inject: [getModelToken(SequelizeOrdersItems)],
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
  imports: [
    NestJsSequelizeModule.forFeature([
      SequelizeOrders,
      SequelizeItems,
      SequelizeOrdersItems,
    ]),
  ],
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
