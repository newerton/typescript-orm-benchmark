import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { Code } from '@core/@shared/domain/error';
import { Exception } from '@core/@shared/domain/exception';
import * as schema from '@core/@shared/infrastructure/adapters/persistence/database/drizzle/schema';
import {
  ItemsRepository,
  ItemsRepositoryCountOutput,
  ItemsRepositoryFilter,
  ItemsRepositoryInput,
  ItemsRepositoryOutput,
} from '@core/items/domain/port/repository';

type Items = typeof schema.items.$inferInsert;

export class ItemsDrizzleRepositoryAdapter implements ItemsRepository {
  constructor(private model: NodePgDatabase<typeof schema>) {}

  async create(entity: ItemsRepositoryInput): Promise<any> {
    const model: Items = {
      name: entity.name,
      value: entity.value,
    };

    try {
      return this.model.insert(schema.items).values(model).returning();
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: `Error creating Items`,
        data: error,
      });
    }
  }

  async findAll(
    page: number,
    limit: number,
    filter: ItemsRepositoryFilter,
  ): Promise<ItemsRepositoryCountOutput> {
    const where = this.extendQueryWithByProperties(filter);

    const skip = limit * (page - 1);
    const take = limit;
    const [data, count] = await prisma.$transaction([
      this.model.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take,
      }),
      this.model.count({ where }),
    ]);

    return {
      data,
      count,
    };
  }

  async findFull(
    filter: ItemsRepositoryFilter,
  ): Promise<ItemsRepositoryOutput[]> {
    const where = this.extendQueryWithByProperties(filter);

    return this.model.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(filter: ItemsRepositoryFilter): Promise<ItemsRepositoryOutput> {
    const where = this.extendQueryWithByProperties(filter);
    return this.model.findFirst({ where });
  }

  async update(
    id: string,
    payload: ItemsRepositoryInput,
  ): Promise<ItemsRepositoryOutput> {
    if (Object.keys(payload).length === 0 && payload.constructor === Object) {
      return null;
    }

    await this._get(id);
    const data = this.prepareDataToUpdate(payload);

    try {
      return this.model.update({ where: { id }, data });
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: `Error updating Items`,
        data: error,
      });
    }
  }

  async delete(id: string) {
    await this._get(id);
    return this.model.delete({ where: { id } });
  }

  async deleteMany(filter: ItemsRepositoryFilter): Promise<any> {
    const newFilter = {
      name: filter.name,
    };
    const where = await this.extendQueryWithByProperties(newFilter);
    if (Object.keys(where).length === 0 && where.constructor === Object) {
      return null;
    }
    return this.model.deleteMany({ where });
  }

  private async _get(id: string): Promise<any> {
    const _id = `${id}`;
    const model = await this.model.findUnique({
      where: { id: _id },
    });
    if (!model) {
      throw Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: `Items not found`,
      });
    }
    return model;
  }

  private extendQueryWithByProperties(filter: ItemsRepositoryFilter): any {
    const query: Drizzle.ItemsWhereInput = {};

    if (filter) {
      if ('id' in filter) {
        query.id = filter.id;
      }

      if ('name' in filter) {
        query.name = {
          contains: filter.name,
          mode: 'insensitive',
        };
      }

      if ('value' in filter) {
        query.value = filter.value;
      }
    }

    return query;
  }

  private prepareDataToUpdate(payload: ItemsRepositoryInput): any {
    const data = {
      ...(payload.name && {
        name: payload.name,
      }),
      ...(payload.value && {
        value: payload.value,
      }),
    };
    return data;
  }
}
