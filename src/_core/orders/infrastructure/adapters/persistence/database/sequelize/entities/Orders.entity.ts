import {
  BelongsToMany,
  Column,
  IsDate,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { SequelizeItems } from '@core/items/infrastructure/adapters/persistence/database/sequelize/entities';
import { Orders } from '@core/orders/domain/entity';
import { SequelizeOrdersItems } from '@core/orders_items/infrastructure/adapters/persistence/database/sequelize/entities';

@Table({ modelName: 'orders', timestamps: false })
export class SequelizeOrders extends Model<Orders> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @Column
  user: string;

  @IsDate
  @Column('created_at')
  created_at: Date;

  @BelongsToMany(() => SequelizeItems, () => SequelizeOrdersItems)
  items: SequelizeItems[];
}
