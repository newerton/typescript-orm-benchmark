import { Module, Provider } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { DatabaseModule } from '@app/@common/infrastructure/adapters/persistente/database/database.module';
import { PrismaDatabaseAdapter } from '@app/@common/infrastructure/adapters/persistente/database/prisma';
import { ItemsDITokens } from '@core/items/domain/di';
import { ItemsPrismaRepositoryAdapter } from '@core/items/infrastructure/adapters/persistence/database/prisma/repository';
import { OrdersDITokens } from '@core/orders/domain/di';
import { OrdersPrismaRepositoryAdapter } from '@core/orders/infrastructure/adapters/persistence/database/prisma/repository';
import { OrdersItemsDITokens } from '@core/orders_items/domain/di';
import { OrdersItemsPrismaRepositoryAdapter } from '@core/orders_items/infrastructure/adapters/persistence/database/prisma/repository';

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
    useFactory: (prisma: PrismaClient) =>
      new OrdersPrismaRepositoryAdapter(prisma.orders),
    inject: [PrismaDatabaseAdapter],
  },
  {
    provide: ItemsDITokens.ItemsRepository,
    useFactory: (prisma: PrismaClient) =>
      new ItemsPrismaRepositoryAdapter(prisma.items),
    inject: [PrismaDatabaseAdapter],
  },
  {
    provide: OrdersItemsDITokens.OrdersItemsRepository,
    useFactory: (prisma: PrismaClient) =>
      new OrdersItemsPrismaRepositoryAdapter(prisma.ordersItems),
    inject: [PrismaDatabaseAdapter],
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
  imports: [DatabaseModule],
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
export class PrismaModule {}
