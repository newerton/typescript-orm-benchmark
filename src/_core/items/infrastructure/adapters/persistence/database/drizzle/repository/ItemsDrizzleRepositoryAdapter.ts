import { asc, count } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { Code } from '@core/@shared/domain/error';
import { Exception } from '@core/@shared/domain/exception';
import {
  drizzleClient,
  drizzleDatabaseAdapter,
} from '@core/@shared/infrastructure/adapters/persistence/database/drizzle/client';
import * as schemas from '@core/@shared/infrastructure/adapters/persistence/database/drizzle/schemas';
import {
  ItemsRepository,
  ItemsRepositoryCountOutput,
  ItemsRepositoryFilter,
  ItemsRepositoryInput,
  ItemsRepositoryOutput,
} from '@core/items/domain/port/repository';

type Items = typeof schemas.items.$inferInsert;

export class ItemsDrizzleRepositoryAdapter implements ItemsRepository {
  constructor(private db: NodePgDatabase<typeof schemas>) {}

  async create(entity: ItemsRepositoryInput): Promise<any> {
    const model: Items = {
      name: entity.name,
      value: entity.value,
    };

    try {
      return this.db.insert(schemas.items).values(model).returning();
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: `Error creating Items`,
        data: error,
      });
    }
  }

  update(
    id: string,
    payload: ItemsRepositoryInput,
  ): Promise<ItemsRepositoryOutput> {
    console.log({ id, payload });
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<any> {
    console.log({ id });
    throw new Error('Method not implemented.');
  }
  deleteMany(filter: ItemsRepositoryFilter): Promise<any> {
    console.log({ filter });
    throw new Error('Method not implemented.');
  }
  findOne(filter: ItemsRepositoryFilter): Promise<ItemsRepositoryOutput> {
    console.log({ filter });
    throw new Error('Method not implemented.');
  }
  findFull(filter: ItemsRepositoryFilter): Promise<ItemsRepositoryOutput[]> {
    console.log({ filter });
    throw new Error('Method not implemented.');
  }

  async findAll(
    page: number,
    limit: number,
    filter: ItemsRepositoryFilter,
  ): Promise<ItemsRepositoryCountOutput> {
    const where = this.extendQueryWithByProperties(filter);

    const skip = limit * (page - 1);
    const take = limit;
    const [data] = await (
      await drizzleDatabaseAdapter(drizzleClient())
    ).transaction(async (tx) => {
      const data = await tx.query.items.findMany({
        where,
        orderBy: [asc(schemas.items.name)],
        offset: skip,
        limit: take,
      });
      const total = await tx.select({ value: count() }).from(schemas.items);
      console.log({ total });
      return [data, total];
    });
    // const [data, count] = await prisma.$transaction([
    //   this.model.findMany({
    //     where,
    //     orderBy: { name: 'asc' },
    //     skip,
    //     take,
    //   }),
    //   this.model.count({ where }),
    // ]);

    return {
      data,
      count: 10,
    };
  }

  // async findFull(
  //   filter: ItemsRepositoryFilter,
  // ): Promise<ItemsRepositoryOutput[]> {
  //   const where = this.extendQueryWithByProperties(filter);

  //   return this.model.findMany({
  //     where,
  //     orderBy: { name: 'asc' },
  //   });
  // }

  // async findOne(filter: ItemsRepositoryFilter): Promise<ItemsRepositoryOutput> {
  //   const where = this.extendQueryWithByProperties(filter);
  //   return this.model.findFirst({ where });
  // }

  // async update(
  //   id: string,
  //   payload: ItemsRepositoryInput,
  // ): Promise<ItemsRepositoryOutput> {
  //   if (Object.keys(payload).length === 0 && payload.constructor === Object) {
  //     return null;
  //   }

  //   await this._get(id);
  //   const data = this.prepareDataToUpdate(payload);

  //   try {
  //     return this.model.update({ where: { id }, data });
  //   } catch (error) {
  //     throw Exception.new({
  //       code: Code.INTERNAL_SERVER_ERROR.code,
  //       overrideMessage: `Error updating Items`,
  //       data: error,
  //     });
  //   }
  // }

  // async delete(id: string) {
  //   await this._get(id);
  //   return this.model.delete({ where: { id } });
  // }

  // async deleteMany(filter: ItemsRepositoryFilter): Promise<any> {
  //   const newFilter = {
  //     name: filter.name,
  //   };
  //   const where = await this.extendQueryWithByProperties(newFilter);
  //   if (Object.keys(where).length === 0 && where.constructor === Object) {
  //     return null;
  //   }
  //   return this.model.deleteMany({ where });
  // }

  // private async _get(id: string): Promise<any> {
  //   const _id = `${id}`;
  //   const model = await this.model.findUnique({
  //     where: { id: _id },
  //   });
  //   if (!model) {
  //     throw Exception.new({
  //       code: Code.NOT_FOUND.code,
  //       overrideMessage: `Items not found`,
  //     });
  //   }
  //   return model;
  // }

  private extendQueryWithByProperties(filter: ItemsRepositoryFilter): any {
    const query = {};

    if (filter) {
      // if ('id' in filter) {
      //   query.id = filter.id;
      // }
      // if ('name' in filter) {
      //   query.name = {
      //     contains: filter.name,
      //     mode: 'insensitive',
      //   };
      // }
      // if ('value' in filter) {
      //   query.value = filter.value;
      // }
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
