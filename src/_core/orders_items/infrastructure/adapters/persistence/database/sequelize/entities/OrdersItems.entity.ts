import {
  Column,
  ForeignKey,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { SequelizeItems } from '@core/items/infrastructure/adapters/persistence/database/sequelize/entities';
import { SequelizeOrders } from '@core/orders/infrastructure/adapters/persistence/database/sequelize/entities';
import { OrdersItems } from '@core/orders_items/domain/entity';

@Table({ modelName: 'orders_items', timestamps: false })
export class SequelizeOrdersItems extends Model<OrdersItems> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @ForeignKey(() => SequelizeOrders)
  @Column
  order_id: string;

  @ForeignKey(() => SequelizeItems)
  @Column
  item_id: string;
}
