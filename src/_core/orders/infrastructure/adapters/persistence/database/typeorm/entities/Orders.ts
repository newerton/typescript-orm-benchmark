import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('orders')
export class TypeOrmOrders {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public user: string;

  @CreateDateColumn()
  public created_at: Date;
}
