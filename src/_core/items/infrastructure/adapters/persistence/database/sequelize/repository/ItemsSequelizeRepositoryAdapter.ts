import { Op, WhereOptions } from 'sequelize';
import { Repository } from 'sequelize-typescript';

import { Optional } from '@core/@shared/domain/type';
import { Items } from '@core/items/domain/entity';
import {
  ItemsRepository,
  ItemsRepositoryCountOutput,
  ItemsRepositoryFilter,
  ItemsRepositoryOutput,
} from '@core/items/domain/port/repository';

import { SequelizeItems } from '../entities';
import { SequelizeItemsMapper } from '../entities/mapper';

export class ItemsSequelizeRepositoryAdapter implements ItemsRepository {
  private readonly tableAlias: string = 'items';
  constructor(private repository: Repository<SequelizeItems>) {}

  async create(payload: Items): Promise<ItemsRepositoryOutput> {
    const orm: SequelizeItems = SequelizeItemsMapper.toOrmEntity(payload);
    return this.repository.create(orm.dataValues);
  }

  async update(id: string, payload: Items): Promise<ItemsRepositoryOutput> {
    await this.findById(id);
    const orm: SequelizeItems = SequelizeItemsMapper.toOrmEntity(payload);
    await this.repository.update(orm, { where: { id } });
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.repository.destroy({ where: { id } });
  }

  async deleteMany(filter: ItemsRepositoryFilter): Promise<any> {
    const newFilter = {
      name: filter.name,
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
    filter: ItemsRepositoryFilter,
  ): Promise<ItemsRepositoryCountOutput> {
    let domainEntities: Optional<Items[]>;

    const skip = limit * (page - 1);
    const take = limit;

    const where = this.extendQueryWithByProperties(filter);

    const ormEntity: Optional<SequelizeItems[]> = await this.repository.findAll(
      {
        where,
        offset: skip,
        limit: take,
        order: [['name', 'ASC']],
      },
    );
    const count = await this.repository.count(where);

    if (ormEntity) {
      domainEntities = SequelizeItemsMapper.toDomainEntities(ormEntity);
    }

    return { data: domainEntities, count: count.length };
  }

  async findFull(
    filter: ItemsRepositoryFilter,
  ): Promise<ItemsRepositoryOutput[]> {
    const where = this.extendQueryWithByProperties(filter);

    const ormEntity: Optional<SequelizeItems[]> = await this.repository.findAll(
      {
        where,
        order: [['name', 'ASC']],
      },
    );

    return SequelizeItemsMapper.toDomainEntities(ormEntity);
  }

  async findOne(
    filter: ItemsRepositoryFilter,
  ): Promise<Optional<ItemsRepositoryOutput>> {
    const where = this.extendQueryWithByProperties(filter);

    const ormEntity: Optional<SequelizeItems> = await this.repository.findOne({
      where,
    });

    return SequelizeItemsMapper.toDomainEntity(ormEntity);
  }

  async findById(id: string): Promise<Items> {
    let domainEntity: Optional<Items>;
    const ormEntity: Optional<SequelizeItems> =
      await this.repository.findByPk(id);

    if (ormEntity) {
      domainEntity = SequelizeItemsMapper.toDomainEntity(ormEntity);
    }

    return domainEntity;
  }

  private extendQueryWithByProperties(filter: ItemsRepositoryFilter): any {
    const query: WhereOptions = {};

    if (filter) {
      if ('id' in filter) {
        query.id = filter.id;
      }

      if ('name' in filter) {
        query.name = { [Op.like]: `%${filter.name}%` };
      }

      if ('value' in filter) {
        query.value = filter.value;
      }
    }

    return query;
  }
}
