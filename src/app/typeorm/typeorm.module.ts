import { Module, Provider } from '@nestjs/common';
import {
  TypeOrmModule as NestJsTypeOrmModule,
  getDataSourceToken,
} from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { ItemsDITokens } from '@core/items/domain/di';
import { TypeOrmItems } from '@core/items/infrastructure/adapters/persistence/database/typeorm/entities';
import { ItemsTypeOrmRepositoryAdapter } from '@core/items/infrastructure/adapters/persistence/database/typeorm/repository';
import { OrdersDITokens } from '@core/orders/domain/di';
import { TypeOrmOrders } from '@core/orders/infrastructure/adapters/persistence/database/typeorm/entities';
import { OrdersTypeOrmRepositoryAdapter } from '@core/orders/infrastructure/adapters/persistence/database/typeorm/repository';
import { OrdersItemsDITokens } from '@core/orders_items/domain/di';
import { TypeOrmOrdersItems } from '@core/orders_items/infrastructure/adapters/persistence/database/typeorm/entities';
import { OrdersItemsTypeOrmRepositoryAdapter } from '@core/orders_items/infrastructure/adapters/persistence/database/typeorm/repository';

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
    useFactory: (dataSource: DataSource) =>
      new OrdersTypeOrmRepositoryAdapter(
        dataSource.getRepository(TypeOrmOrders),
      ),
    inject: [getDataSourceToken()],
  },
  {
    provide: ItemsDITokens.ItemsRepository,
    useFactory: (dataSource: DataSource) =>
      new ItemsTypeOrmRepositoryAdapter(dataSource.getRepository(TypeOrmItems)),
    inject: [getDataSourceToken()],
  },
  {
    provide: OrdersItemsDITokens.OrdersItemsRepository,
    useFactory: (dataSource: DataSource) =>
      new OrdersItemsTypeOrmRepositoryAdapter(
        dataSource.getRepository(TypeOrmOrdersItems),
      ),
    inject: [getDataSourceToken()],
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
  imports: [NestJsTypeOrmModule.forFeature([TypeOrmOrders])],
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
export class TypeOrmModule {}
