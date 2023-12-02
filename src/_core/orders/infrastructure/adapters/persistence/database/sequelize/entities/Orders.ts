import {
  Column,
  IsDate,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Orders } from '@core/orders/domain/entity';

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
}
