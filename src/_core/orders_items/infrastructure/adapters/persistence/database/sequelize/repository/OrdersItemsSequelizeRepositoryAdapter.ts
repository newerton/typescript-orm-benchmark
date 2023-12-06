import { WhereOptions } from 'sequelize';
import { Repository } from 'sequelize-typescript';

import { Optional } from '@core/@shared/domain/type';
import { OrdersItems } from '@core/orders_items/domain/entity';
import {
  OrdersItemsRepository,
  OrdersItemsRepositoryCountOutput,
  OrdersItemsRepositoryFilter,
  OrdersItemsRepositoryOutput,
} from '@core/orders_items/domain/port/repository';

import { SequelizeOrdersItems } from '../entities';
import { SequelizeOrdersItemsMapper } from '../entities/mapper';

export class OrdersItemsSequelizeRepositoryAdapter
  implements OrdersItemsRepository
{
  private readonly tableAlias: string = 'orders_items';
  constructor(private repository: Repository<SequelizeOrdersItems>) {}

  async create(payload: OrdersItems): Promise<OrdersItemsRepositoryOutput> {
    const orm: SequelizeOrdersItems =
      SequelizeOrdersItemsMapper.toOrmEntity(payload);
    return this.repository.create(orm.dataValues);
  }

  async update(
    id: string,
    payload: OrdersItems,
  ): Promise<OrdersItemsRepositoryOutput> {
    await this.findById(id);
    const orm: SequelizeOrdersItems =
      SequelizeOrdersItemsMapper.toOrmEntity(payload);
    await this.repository.update(orm, { where: { id } });
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.repository.destroy({ where: { id } });
  }

  async deleteMany(filter: OrdersItemsRepositoryFilter): Promise<any> {
    const newFilter = {
      order_id: filter.order_id,
    };
    const where = this.extendQueryWithByProperties(newFilter);
    if (Object.keys(where).length === 0 && where.constructor === Object) {
      return null;
    }
    return this.repository.destroy(where);
  }

  async findAll(
    page: number,
    limit: number,
    filter: OrdersItemsRepositoryFilter,
  ): Promise<OrdersItemsRepositoryCountOutput> {
    let domainEntities: Optional<OrdersItems[]>;

    const skip = limit * (page - 1);
    const take = limit;

    const where = this.extendQueryWithByProperties(filter);

    const ormEntity: Optional<SequelizeOrdersItems[]> =
      await this.repository.findAll({ where, offset: skip, limit: take });
    const count = await this.repository.count(where);

    if (ormEntity) {
      domainEntities = SequelizeOrdersItemsMapper.toDomainEntities(ormEntity);
    }

    return { data: domainEntities, count: count.length };
  }

  async findFull(
    filter: OrdersItemsRepositoryFilter,
  ): Promise<OrdersItemsRepositoryOutput[]> {
    const where = this.extendQueryWithByProperties(filter);

    const ormEntity: Optional<SequelizeOrdersItems[]> =
      await this.repository.findAll({ where });

    return SequelizeOrdersItemsMapper.toDomainEntities(ormEntity);
  }

  async findOne(
    filter: OrdersItemsRepositoryFilter,
  ): Promise<Optional<OrdersItemsRepositoryOutput>> {
    const where = this.extendQueryWithByProperties(filter);

    const ormEntity: Optional<SequelizeOrdersItems> =
      await this.repository.findOne({ where });

    return SequelizeOrdersItemsMapper.toDomainEntity(ormEntity);
  }

  async findById(id: string): Promise<OrdersItems> {
    let domainEntity: Optional<OrdersItems>;
    const ormEntity: Optional<SequelizeOrdersItems> =
      await this.repository.findByPk(id);

    if (ormEntity) {
      domainEntity = SequelizeOrdersItemsMapper.toDomainEntity(ormEntity);
    }

    return domainEntity;
  }

  private extendQueryWithByProperties(
    filter: OrdersItemsRepositoryFilter,
  ): any {
    const query: WhereOptions = {};

    if (filter) {
      if ('id' in filter) {
        query.id = filter.id;
      }

      if ('order_id' in filter) {
        query.order_id = filter.order_id;
      }

      if ('item_id' in filter) {
        query.item_id = filter.item_id;
      }
    }

    return query;
  }
}
