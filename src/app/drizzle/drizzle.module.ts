import { Module, Provider } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DatabaseModule } from '@app/@common/infrastructure/adapters/persistente/database/database.module';
import * as schemas from '@core/@shared/infrastructure/adapters/persistence/database/drizzle/schemas';
import { ItemsDITokens } from '@core/items/domain/di';
import { ItemsDrizzleRepositoryAdapter } from '@core/items/infrastructure/adapters/persistence/database/drizzle/repository';
import { OrdersDITokens } from '@core/orders/domain/di';
import { OrdersDrizzleRepositoryAdapter } from '@core/orders/infrastructure/adapters/persistence/database/drizzle/repository';
import { OrdersItemsDITokens } from '@core/orders_items/domain/di';
import { OrdersItemsDrizzleRepositoryAdapter } from '@core/orders_items/infrastructure/adapters/persistence/database/drizzle/repository';

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
    useFactory: (db: NodePgDatabase<typeof schemas>) =>
      new OrdersDrizzleRepositoryAdapter(db),
    inject: ['DRIZZLE_DATABASE_ADAPTER'],
  },
  {
    provide: ItemsDITokens.ItemsRepository,
    useFactory: (db: NodePgDatabase<typeof schemas>) =>
      new ItemsDrizzleRepositoryAdapter(db),
    inject: ['DRIZZLE_DATABASE_ADAPTER'],
  },
  {
    provide: OrdersItemsDITokens.OrdersItemsRepository,
    useFactory: (db: NodePgDatabase<typeof schemas>) =>
      new OrdersItemsDrizzleRepositoryAdapter(db),
    inject: ['DRIZZLE_DATABASE_ADAPTER'],
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
export class DrizzleModule {}
