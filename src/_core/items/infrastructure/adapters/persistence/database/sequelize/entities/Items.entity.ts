import {
  BelongsToMany,
  Column,
  IsDecimal,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Items } from '@core/items/domain/entity';
import { SequelizeOrders } from '@core/orders/infrastructure/adapters/persistence/database/sequelize/entities';
import { SequelizeOrdersItems } from '@core/orders_items/infrastructure/adapters/persistence/database/sequelize/entities';

@Table({ modelName: 'items', timestamps: false })
export class SequelizeItems extends Model<Items> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @Column
  name: string;

  @IsDecimal
  @Column
  value: number;

  @BelongsToMany(() => SequelizeOrders, () => SequelizeOrdersItems)
  orders: SequelizeOrders[];
}
