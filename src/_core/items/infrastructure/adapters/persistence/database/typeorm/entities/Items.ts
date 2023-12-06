import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('items')
export class TypeOrmItems {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  public value: number;
}
