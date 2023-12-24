import { count } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { Code } from '@core/@shared/domain/error';
import { Exception } from '@core/@shared/domain/exception';
import * as schemas from '@core/@shared/infrastructure/adapters/persistence/database/drizzle/schemas';
import {
  OrdersItemsRepository,
  OrdersItemsRepositoryCountOutput,
  OrdersItemsRepositoryFilter,
  OrdersItemsRepositoryInput,
  OrdersItemsRepositoryOutput,
} from '@core/orders_items/domain/port/repository';

type OrdersItemsInsert = typeof schemas.ordersToItems.$inferInsert;

export class OrdersItemsDrizzleRepositoryAdapter
  implements OrdersItemsRepository
{
  constructor(private db: NodePgDatabase<typeof schemas>) {}

  async create(entity: OrdersItemsRepositoryInput): Promise<any> {
    const model: OrdersItemsInsert = {
      order_id: entity.order_id,
      item_id: entity.item_id,
    };

    try {
      return this.db.insert(schemas.ordersToItems).values(model).returning();
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: `Error creating Orders Items`,
        data: error,
      });
    }
  }

  update(
    id: string,
    payload: OrdersItemsRepositoryInput,
  ): Promise<OrdersItemsRepositoryOutput> {
    console.log({ id, payload });
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<any> {
    console.log({ id });
    throw new Error('Method not implemented.');
  }
  deleteMany(filter: OrdersItemsRepositoryFilter): Promise<any> {
    console.log({ filter });
    throw new Error('Method not implemented.');
  }
  findOne(
    filter: OrdersItemsRepositoryFilter,
  ): Promise<OrdersItemsRepositoryOutput> {
    console.log({ filter });
    throw new Error('Method not implemented.');
  }
  findFull(
    filter: OrdersItemsRepositoryFilter,
  ): Promise<OrdersItemsRepositoryOutput[]> {
    console.log({ filter });
    throw new Error('Method not implemented.');
  }

  async findAll(
    page: number,
    limit: number,
    filter: OrdersItemsRepositoryFilter,
  ): Promise<OrdersItemsRepositoryCountOutput> {
    const where = this.extendQueryWithByProperties(filter);

    const skip = limit * (page - 1);
    const take = limit;

    const data = await this.db.query.ordersToItems.findMany({
      where,
      offset: skip,
      limit: take,
    });

    const total = await this.db
      .select({ value: count() })
      .from(schemas.ordersToItems);

    return {
      data,
      count: total[0].value,
    };
  }

  // async findFull(
  //   filter: OrdersItemsRepositoryFilter,
  // ): Promise<OrdersItemsRepositoryOutput[]> {
  //   const where = this.extendQueryWithByProperties(filter);

  //   return this.model.findMany({
  //     where,
  //     orderBy: { name: 'asc' },
  //   });
  // }

  // async findOne(filter: OrdersItemsRepositoryFilter): Promise<OrdersItemsRepositoryOutput> {
  //   const where = this.extendQueryWithByProperties(filter);
  //   return this.model.findFirst({ where });
  // }

  // async update(
  //   id: string,
  //   payload: OrdersItemsRepositoryInput,
  // ): Promise<OrdersItemsRepositoryOutput> {
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
  //       overrideMessage: `Error updating Orders Items`,
  //       data: error,
  //     });
  //   }
  // }

  // async delete(id: string) {
  //   await this._get(id);
  //   return this.model.delete({ where: { id } });
  // }

  // async deleteMany(filter: OrdersItemsRepositoryFilter): Promise<any> {
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
  //       overrideMessage: `OrdersItems not found`,
  //     });
  //   }
  //   return model;
  // }

  private extendQueryWithByProperties(
    filter: OrdersItemsRepositoryFilter,
  ): any {
    const query = null;

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

  private prepareDataToUpdate(payload: OrdersItemsRepositoryInput): any {
    const data = {
      ...(payload.order_id && {
        order_id: payload.order_id,
      }),
      ...(payload.item_id && {
        item_id: payload.item_id,
      }),
    };
    return data;
  }
}
