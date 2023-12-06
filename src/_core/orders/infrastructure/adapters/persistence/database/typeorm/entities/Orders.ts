import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TypeOrmItems } from '@core/items/infrastructure/adapters/persistence/database/typeorm/entities';

@Entity('orders')
export class TypeOrmOrders {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public user: string;

  @CreateDateColumn()
  public created_at: Date;

  @ManyToMany(() => TypeOrmItems)
  @JoinTable({
    name: 'orders_items',
    joinColumn: {
      name: 'order_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'item_id',
      referencedColumnName: 'id',
    },
  })
  public items: TypeOrmItems[];
}
