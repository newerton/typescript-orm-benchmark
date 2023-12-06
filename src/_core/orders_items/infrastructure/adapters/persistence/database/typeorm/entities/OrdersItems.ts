import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('orders_items')
export class TypeOrmOrdersItems {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public order_id: string;

  @Column()
  public item_id: string;
}
