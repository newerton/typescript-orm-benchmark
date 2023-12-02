import { Op, WhereOptions } from 'sequelize';
import { Repository } from 'sequelize-typescript';

import { Optional } from '@core/@shared/domain/type';
import { Orders } from '@core/orders/domain/entity';
import {
  OrdersRepository,
  OrdersRepositoryCountOutput,
  OrdersRepositoryFilter,
  OrdersRepositoryOutput,
} from '@core/orders/domain/port/repository';

import { SequelizeOrders } from '../entities';
import { SequelizeOrdersMapper } from '../entities/mapper';

export class OrdersSequelizeRepositoryAdapter implements OrdersRepository {
  private readonly tableAlias: string = 'orders';
  constructor(private repository: Repository<SequelizeOrders>) {}

  async create(payload: Orders): Promise<OrdersRepositoryOutput> {
    const orm: SequelizeOrders = SequelizeOrdersMapper.toOrmEntity(payload);
    return this.repository.create({
      ...orm,
    });
  }

  async update(id: string, payload: Orders): Promise<OrdersRepositoryOutput> {
    await this.findById(id);
    const orm: SequelizeOrders = SequelizeOrdersMapper.toOrmEntity(payload);
    await this.repository.update(orm, { where: { id } });
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.repository.destroy({ where: { id } });
  }

  async deleteMany(filter: OrdersRepositoryFilter): Promise<any> {
    const newFilter = {
      user: filter.user,
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
    filter: OrdersRepositoryFilter,
  ): Promise<OrdersRepositoryCountOutput> {
    let domainEntities: Optional<Orders[]>;

    const skip = limit * (page - 1);
    const take = limit;

    const where = this.extendQueryWithByProperties(filter);

    const ormEntity: Optional<SequelizeOrders[]> =
      await this.repository.findAll({
        where,
        offset: skip,
        limit: take,
        order: [['created_at', 'DESC']],
      });
    const count = await this.repository.count(where);

    if (ormEntity) {
      domainEntities = SequelizeOrdersMapper.toDomainEntities(ormEntity);
    }

    return { data: domainEntities, count: count.length };
  }

  async findFull(
    filter: OrdersRepositoryFilter,
  ): Promise<OrdersRepositoryOutput[]> {
    const where = this.extendQueryWithByProperties(filter);

    const ormEntity: Optional<SequelizeOrders[]> =
      await this.repository.findAll({
        where,
        order: [['created_at', 'DESC']],
      });

    return SequelizeOrdersMapper.toDomainEntities(ormEntity);
  }

  async findOne(
    filter: OrdersRepositoryFilter,
  ): Promise<Optional<OrdersRepositoryOutput>> {
    const where = this.extendQueryWithByProperties(filter);

    const ormEntity: Optional<SequelizeOrders> = await this.repository.findOne({
      where,
    });

    return SequelizeOrdersMapper.toDomainEntity(ormEntity);
  }

  async findById(id: string): Promise<Orders> {
    let domainEntity: Optional<Orders>;
    const ormEntity: Optional<SequelizeOrders> =
      await this.repository.findByPk(id);

    if (ormEntity) {
      domainEntity = SequelizeOrdersMapper.toDomainEntity(ormEntity);
    }

    return domainEntity;
  }

  private extendQueryWithByProperties(filter: OrdersRepositoryFilter): any {
    const query: WhereOptions = {};

    if (filter) {
      if ('id' in filter) {
        query.id = filter.id;
      }

      if ('user' in filter) {
        query.user = { [Op.like]: `%${filter.user}%` };
      }
    }

    return query;
  }
}
