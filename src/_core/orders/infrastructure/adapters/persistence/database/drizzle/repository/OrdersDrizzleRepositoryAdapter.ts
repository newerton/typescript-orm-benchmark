import { SQL, and, count, desc, eq, ilike } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { Code } from '@core/@shared/domain/error';
import { Exception } from '@core/@shared/domain/exception';
import * as schemas from '@core/@shared/infrastructure/adapters/persistence/database/drizzle/schemas';
import {
  OrdersRepository,
  OrdersRepositoryCountOutput,
  OrdersRepositoryFilter,
  OrdersRepositoryInput,
  OrdersRepositoryOutput,
} from '@core/orders/domain/port/repository';

type OrdersInsert = typeof schemas.orders.$inferInsert;

export class OrdersDrizzleRepositoryAdapter implements OrdersRepository {
  constructor(private db: NodePgDatabase<typeof schemas>) {}

  async create(entity: OrdersRepositoryInput): Promise<any> {
    const model: OrdersInsert = {
      user: entity.user,
    };

    try {
      return this.db.insert(schemas.orders).values(model).returning();
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: `Error creating Orders`,
        data: error,
      });
    }
  }

  update(
    id: string,
    payload: OrdersRepositoryInput,
  ): Promise<OrdersRepositoryOutput> {
    console.log({ id, payload });
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<any> {
    console.log({ id });
    throw new Error('Method not implemented.');
  }
  deleteMany(filter: OrdersRepositoryFilter): Promise<any> {
    console.log({ filter });
    throw new Error('Method not implemented.');
  }
  async findOne(
    filter: OrdersRepositoryFilter,
  ): Promise<OrdersRepositoryOutput> {
    const where = this.extendQueryWithByProperties(filter);

    const model = await this.db.query.orders.findFirst({
      where,
      with: {
        ordersToItems: {
          with: {
            item: true,
          },
        },
      },
    });

    if (!model) {
      throw Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: `Orders not found`,
      });
    }

    return {
      ...model,
      created_at: new Date(model.created_at),
    };
  }
  findFull(filter: OrdersRepositoryFilter): Promise<OrdersRepositoryOutput[]> {
    console.log({ filter });
    throw new Error('Method not implemented.');
  }

  async findAll(
    page: number,
    limit: number,
    filter: OrdersRepositoryFilter,
  ): Promise<OrdersRepositoryCountOutput> {
    const where = this.extendQueryWithByProperties(filter);

    const skip = limit * (page - 1);
    const take = limit;

    const data = await this.db.query.orders.findMany({
      where,
      orderBy: [desc(schemas.orders.created_at)],
      offset: skip,
      limit: take,
    });

    const total = await this.db.select({ value: count() }).from(schemas.orders);

    const newData = [];
    for (const item of data) {
      newData.push({
        ...item,
        created_at: new Date(item.created_at),
      });
    }

    return {
      data: newData,
      count: total[0].value,
    };
  }

  // async findFull(
  //   filter: OrdersRepositoryFilter,
  // ): Promise<OrdersRepositoryOutput[]> {
  //   const where = this.extendQueryWithByProperties(filter);

  //   return this.model.findMany({
  //     where,
  //     orderBy: { name: 'asc' },
  //   });
  // }

  // async update(
  //   id: string,
  //   payload: OrdersRepositoryInput,
  // ): Promise<OrdersRepositoryOutput> {
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
  //       overrideMessage: `Error updating Orders`,
  //       data: error,
  //     });
  //   }
  // }

  // async delete(id: string) {
  //   await this._get(id);
  //   return this.model.delete({ where: { id } });
  // }

  // async deleteMany(filter: OrdersRepositoryFilter): Promise<any> {
  //   const newFilter = {
  //     name: filter.name,
  //   };
  //   const where = await this.extendQueryWithByProperties(newFilter);
  //   if (Object.keys(where).length === 0 && where.constructor === Object) {
  //     return null;
  //   }
  //   return this.model.deleteMany({ where });
  // }

  private async _get(id: string): Promise<any> {
    const _id = `${id}`;
    const model = await this.db.query.orders.findFirst({
      where: eq(schemas.orders.id, _id),
    });

    if (!model) {
      throw Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: `Orders not found`,
      });
    }

    return {
      ...model,
      created_at: new Date(model.created_at),
    };
  }

  private extendQueryWithByProperties(filter: OrdersRepositoryFilter): any {
    let query: SQL<unknown> = null;
    const prepareQuery = [];

    if (filter) {
      if ('id' in filter) {
        prepareQuery.push(eq(schemas.orders.id, filter.id));
      }
      if ('user' in filter) {
        prepareQuery.push(ilike(schemas.orders.user, `%${filter.user}%`));
      }
    }

    if (prepareQuery.length > 0) {
      query = and(...prepareQuery);
    }

    return query;
  }

  private prepareDataToUpdate(payload: OrdersRepositoryInput): any {
    const data = {
      ...(payload.user && {
        user: payload.user,
      }),
    };
    return data;
  }
}
