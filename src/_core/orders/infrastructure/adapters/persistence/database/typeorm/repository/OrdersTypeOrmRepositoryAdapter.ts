import { Repository, SelectQueryBuilder } from 'typeorm';

import { Optional } from '@core/@shared/domain/type';
import { Orders } from '@core/orders/domain/entity';
import {
  OrdersRepository,
  OrdersRepositoryCountOutput,
  OrdersRepositoryFilter,
  OrdersRepositoryOutput,
} from '@core/orders/domain/port/repository';

import { TypeOrmOrders } from '../entities';
import { TypeOrmOrdersMapper } from '../entities/mapper';

export class OrdersTypeOrmRepositoryAdapter implements OrdersRepository {
  private readonly tableAlias: string = 'orders';
  constructor(private repository: Repository<TypeOrmOrders>) {}

  async create(payload: Orders): Promise<OrdersRepositoryOutput> {
    const orm: TypeOrmOrders = TypeOrmOrdersMapper.toOrmEntity(payload);
    return this.repository.save(orm);
  }

  async update(id: string, payload: Orders): Promise<OrdersRepositoryOutput> {
    await this.findById(id);
    const orm: TypeOrmOrders = TypeOrmOrdersMapper.toOrmEntity(payload);
    await this.repository.update(orm.id, orm);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.repository.softDelete(id);
  }

  async deleteMany(filter: OrdersRepositoryFilter): Promise<any> {
    const query: SelectQueryBuilder<TypeOrmOrders> = this.buildQueryBuilder();
    this.extendQueryWithByProperties(filter, query);
    return query.delete().execute();
  }

  async findAll(
    page: number,
    limit: number,
    filter: OrdersRepositoryFilter,
  ): Promise<OrdersRepositoryCountOutput> {
    const skip = limit * (page - 1);
    const take = limit;

    const query: SelectQueryBuilder<TypeOrmOrders> = this.buildQueryBuilder();

    this.extendQueryWithByProperties(filter, query);

    const ormEntity: Optional<TypeOrmOrders[]> = await query
      .orderBy({ created_at: 'DESC' })
      .innerJoinAndSelect(`${this.tableAlias}.items`, 'items')
      .offset(skip)
      .limit(take)
      .getMany();
    const count = await query.getCount();

    return { data: ormEntity, count };
  }

  async findFull(
    filter: OrdersRepositoryFilter,
  ): Promise<OrdersRepositoryOutput[]> {
    const query: SelectQueryBuilder<TypeOrmOrders> = this.buildQueryBuilder();

    this.extendQueryWithByProperties(filter, query);

    const ormEntity: Optional<TypeOrmOrders[]> = await query
      .orderBy({ created_at: 'DESC' })
      .getMany();

    return ormEntity;
  }

  async findOne(
    filter: OrdersRepositoryFilter,
  ): Promise<Optional<OrdersRepositoryOutput>> {
    const query: SelectQueryBuilder<TypeOrmOrders> = this.buildQueryBuilder();

    this.extendQueryWithByProperties(filter, query);

    const ormEntity: Optional<TypeOrmOrders> = await query
      .innerJoinAndSelect(`${this.tableAlias}.items`, 'items')
      .getOne();

    return ormEntity;
  }

  async findById(id: string): Promise<Optional<Orders>> {
    let domainEntity: Optional<Orders>;

    const query: SelectQueryBuilder<TypeOrmOrders> = this.buildQueryBuilder();

    this.extendQueryWithByProperties({ id: id }, query);

    const ormEntity: Optional<TypeOrmOrders> = await query.getOne();

    if (ormEntity) {
      domainEntity = TypeOrmOrdersMapper.toDomainEntity(ormEntity);
    }

    return domainEntity;
  }

  private buildQueryBuilder(): SelectQueryBuilder<TypeOrmOrders> {
    return this.repository.createQueryBuilder(this.tableAlias).select();
  }

  private extendQueryWithByProperties(
    filter: { id?: string; name?: string },
    query: SelectQueryBuilder<TypeOrmOrders>,
  ): void {
    if (filter) {
      if ('id' in filter) {
        query.andWhere(`"${this.tableAlias}"."id" = :id`, { id: filter.id });
      }
      if ('user' in filter) {
        query.andWhere(`"${this.tableAlias}"."user" LIKE :user`, {
          user: filter.user,
        });
      }
    }
  }
}
