import { Repository, SelectQueryBuilder } from 'typeorm';

import { Optional } from '@core/@shared/domain/type';
import { OrdersItems } from '@core/orders_items/domain/entity';
import {
  OrdersItemsRepository,
  OrdersItemsRepositoryCountOutput,
  OrdersItemsRepositoryFilter,
  OrdersItemsRepositoryOutput,
} from '@core/orders_items/domain/port/repository';

import { TypeOrmOrdersItems } from '../entities';
import { TypeOrmOrdersItemsMapper } from '../entities/mapper';

export class OrdersItemsTypeOrmRepositoryAdapter
  implements OrdersItemsRepository
{
  private readonly tableAlias: string = 'orders_items';
  constructor(private repository: Repository<TypeOrmOrdersItems>) {}

  async create(payload: OrdersItems): Promise<OrdersItemsRepositoryOutput> {
    const orm: TypeOrmOrdersItems =
      TypeOrmOrdersItemsMapper.toOrmEntity(payload);
    return this.repository.save(orm);
  }

  async update(
    id: string,
    payload: OrdersItems,
  ): Promise<OrdersItemsRepositoryOutput> {
    await this.findById(id);
    const orm: TypeOrmOrdersItems =
      TypeOrmOrdersItemsMapper.toOrmEntity(payload);
    await this.repository.update(orm.id, orm);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.repository.softDelete(id);
  }

  async deleteMany(filter: OrdersItemsRepositoryFilter): Promise<any> {
    const query: SelectQueryBuilder<TypeOrmOrdersItems> =
      this.buildQueryBuilder();
    this.extendQueryWithByProperties(filter, query);
    return query.delete().execute();
  }

  async findAll(
    page: number,
    limit: number,
    filter: OrdersItemsRepositoryFilter,
  ): Promise<OrdersItemsRepositoryCountOutput> {
    let domainEntities: Optional<OrdersItems[]>;

    const skip = limit * (page - 1);
    const take = limit;

    const query: SelectQueryBuilder<TypeOrmOrdersItems> =
      this.buildQueryBuilder();

    this.extendQueryWithByProperties(filter, query);

    const ormEntity: Optional<TypeOrmOrdersItems[]> = await query
      .offset(skip)
      .limit(take)
      .getMany();
    const count = await query.getCount();

    if (ormEntity) {
      domainEntities = TypeOrmOrdersItemsMapper.toDomainEntities(ormEntity);
    }

    return { data: domainEntities, count };
  }

  async findFull(
    filter: OrdersItemsRepositoryFilter,
  ): Promise<OrdersItemsRepositoryOutput[]> {
    const query: SelectQueryBuilder<TypeOrmOrdersItems> =
      this.buildQueryBuilder();

    this.extendQueryWithByProperties(filter, query);

    const ormEntity: Optional<TypeOrmOrdersItems[]> = await query
      .orderBy({ created_at: 'DESC' })
      .getMany();

    return TypeOrmOrdersItemsMapper.toDomainEntities(ormEntity);
  }

  async findOne(
    filter: OrdersItemsRepositoryFilter,
  ): Promise<Optional<OrdersItemsRepositoryOutput>> {
    const query: SelectQueryBuilder<TypeOrmOrdersItems> =
      this.buildQueryBuilder();

    this.extendQueryWithByProperties(filter, query);

    const ormEntity: Optional<TypeOrmOrdersItems> = await query.getOne();

    return TypeOrmOrdersItemsMapper.toDomainEntity(ormEntity);
  }

  async findById(id: string): Promise<Optional<OrdersItems>> {
    let domainEntity: Optional<OrdersItems>;

    const query: SelectQueryBuilder<TypeOrmOrdersItems> =
      this.buildQueryBuilder();

    this.extendQueryWithByProperties({ id: id }, query);

    const ormEntity: Optional<TypeOrmOrdersItems> = await query.getOne();

    if (ormEntity) {
      domainEntity = TypeOrmOrdersItemsMapper.toDomainEntity(ormEntity);
    }

    return domainEntity;
  }

  private buildQueryBuilder(): SelectQueryBuilder<TypeOrmOrdersItems> {
    return this.repository.createQueryBuilder(this.tableAlias).select();
  }

  private extendQueryWithByProperties(
    filter: { id?: string; name?: string },
    query: SelectQueryBuilder<TypeOrmOrdersItems>,
  ): void {
    if (filter) {
      if ('id' in filter) {
        query.andWhere(`"${this.tableAlias}"."id" = :id`, { id: filter.id });
      }

      if ('order_id' in filter) {
        query.andWhere(`"${this.tableAlias}"."order_id" = :order_id`, {
          order_id: filter.order_id,
        });
      }

      if ('item_id' in filter) {
        query.andWhere(`"${this.tableAlias}"."item_id" = :item_id`, {
          item_id: filter.item_id,
        });
      }
    }
  }
}
