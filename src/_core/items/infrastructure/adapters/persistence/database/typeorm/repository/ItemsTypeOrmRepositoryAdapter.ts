import { Repository, SelectQueryBuilder } from 'typeorm';

import { Optional } from '@core/@shared/domain/type';
import { Items } from '@core/items/domain/entity';
import {
  ItemsRepository,
  ItemsRepositoryCountOutput,
  ItemsRepositoryFilter,
  ItemsRepositoryOutput,
} from '@core/items/domain/port/repository';

import { TypeOrmItems } from '../entities';
import { TypeOrmItemsMapper } from '../entities/mapper';

export class ItemsTypeOrmRepositoryAdapter implements ItemsRepository {
  private readonly tableAlias: string = 'items';
  constructor(private repository: Repository<TypeOrmItems>) {}

  async create(payload: Items): Promise<ItemsRepositoryOutput> {
    const orm: TypeOrmItems = TypeOrmItemsMapper.toOrmEntity(payload);
    return this.repository.save(orm);
  }

  async update(id: string, payload: Items): Promise<ItemsRepositoryOutput> {
    await this.findById(id);
    const orm: TypeOrmItems = TypeOrmItemsMapper.toOrmEntity(payload);
    await this.repository.update(orm.id, orm);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.repository.softDelete(id);
  }

  async deleteMany(filter: ItemsRepositoryFilter): Promise<any> {
    const query: SelectQueryBuilder<TypeOrmItems> = this.buildQueryBuilder();
    this.extendQueryWithByProperties(filter, query);
    return query.delete().execute();
  }

  async findAll(
    page: number,
    limit: number,
    filter: ItemsRepositoryFilter,
  ): Promise<ItemsRepositoryCountOutput> {
    let domainEntities: Optional<Items[]>;

    const skip = limit * (page - 1);
    const take = limit;

    const query: SelectQueryBuilder<TypeOrmItems> = this.buildQueryBuilder();

    this.extendQueryWithByProperties(filter, query);

    const ormEntity: Optional<TypeOrmItems[]> = await query
      .orderBy({ name: 'ASC' })
      .offset(skip)
      .limit(take)
      .getMany();
    const count = await query.getCount();

    if (ormEntity) {
      domainEntities = TypeOrmItemsMapper.toDomainEntities(ormEntity);
    }

    return { data: domainEntities, count };
  }

  async findFull(
    filter: ItemsRepositoryFilter,
  ): Promise<ItemsRepositoryOutput[]> {
    const query: SelectQueryBuilder<TypeOrmItems> = this.buildQueryBuilder();

    this.extendQueryWithByProperties(filter, query);

    const ormEntity: Optional<TypeOrmItems[]> = await query
      .orderBy({ name: 'ASC' })
      .getMany();

    return TypeOrmItemsMapper.toDomainEntities(ormEntity);
  }

  async findOne(
    filter: ItemsRepositoryFilter,
  ): Promise<Optional<ItemsRepositoryOutput>> {
    const query: SelectQueryBuilder<TypeOrmItems> = this.buildQueryBuilder();

    this.extendQueryWithByProperties(filter, query);

    const ormEntity: Optional<TypeOrmItems> = await query.getOne();

    return TypeOrmItemsMapper.toDomainEntity(ormEntity);
  }

  async findById(id: string): Promise<Optional<Items>> {
    let domainEntity: Optional<Items>;

    const query: SelectQueryBuilder<TypeOrmItems> = this.buildQueryBuilder();

    this.extendQueryWithByProperties({ id: id }, query);

    const ormEntity: Optional<TypeOrmItems> = await query.getOne();

    if (ormEntity) {
      domainEntity = TypeOrmItemsMapper.toDomainEntity(ormEntity);
    }

    return domainEntity;
  }

  private buildQueryBuilder(): SelectQueryBuilder<TypeOrmItems> {
    return this.repository.createQueryBuilder(this.tableAlias).select();
  }

  private extendQueryWithByProperties(
    filter: { id?: string; name?: string },
    query: SelectQueryBuilder<TypeOrmItems>,
  ): void {
    if (filter) {
      if ('id' in filter) {
        query.andWhere(`"${this.tableAlias}"."id" = :id`, { id: filter.id });
      }

      if ('name' in filter) {
        query.andWhere(`"${this.tableAlias}"."name" LIKE :name`, {
          name: filter.name,
        });
      }

      if ('value' in filter) {
        query.andWhere(`"${this.tableAlias}"."value" = :value`, {
          value: filter.value,
        });
      }
    }
  }
}
