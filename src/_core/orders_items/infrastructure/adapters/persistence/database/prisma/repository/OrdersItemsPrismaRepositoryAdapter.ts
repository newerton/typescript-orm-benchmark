import { Prisma, PrismaClient } from '@prisma/client';

import { Code } from '@core/@shared/domain/error';
import { Exception } from '@core/@shared/domain/exception';
import { prisma } from '@core/@shared/infrastructure/adapters/persistence/database/prisma';
import {
  OrdersItemsRepository,
  OrdersItemsRepositoryCountOutput,
  OrdersItemsRepositoryFilter,
  OrdersItemsRepositoryInput,
  OrdersItemsRepositoryOutput,
} from '@core/orders_items/domain/port/repository';

export class OrdersItemsPrismaRepositoryAdapter
  implements OrdersItemsRepository
{
  constructor(private model: PrismaClient['ordersItems']) {}

  async create(
    entity: OrdersItemsRepositoryInput,
  ): Promise<OrdersItemsRepositoryOutput> {
    const model: Prisma.OrdersItemsCreateInput = {
      orders: {
        connect: {
          id: entity.order_id,
        },
      },
      items: {
        connect: {
          id: entity.item_id,
        },
      },
    };

    try {
      const response = await this.model.create({
        data: model,
      });
      return response;
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: `Error creating OrdersItems`,
        data: error,
      });
    }
  }

  async findAll(
    page: number,
    limit: number,
    filter: OrdersItemsRepositoryFilter,
  ): Promise<OrdersItemsRepositoryCountOutput> {
    const where = this.extendQueryWithByProperties(filter);

    const skip = limit * (page - 1);
    const take = limit;
    const [data, count] = await prisma.$transaction([
      this.model.findMany({ where, skip, take }),
      this.model.count({ where }),
    ]);

    return {
      data,
      count,
    };
  }

  async findFull(
    filter: OrdersItemsRepositoryFilter,
  ): Promise<OrdersItemsRepositoryOutput[]> {
    const where = this.extendQueryWithByProperties(filter);

    return this.model.findMany({ where });
  }

  async findOne(
    filter: OrdersItemsRepositoryFilter,
  ): Promise<OrdersItemsRepositoryOutput> {
    const where = this.extendQueryWithByProperties(filter);
    return this.model.findFirst({ where });
  }

  async update(
    id: string,
    payload: OrdersItemsRepositoryInput,
  ): Promise<OrdersItemsRepositoryOutput> {
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
        overrideMessage: `Error updating OrdersItems`,
        data: error,
      });
    }
  }

  async delete(id: string) {
    await this._get(id);
    return this.model.delete({ where: { id } });
  }

  async deleteMany(filter: OrdersItemsRepositoryFilter): Promise<any> {
    const newFilter = {
      order_id: filter.order_id,
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
        overrideMessage: `OrdersItems not found`,
      });
    }
    return model;
  }

  private extendQueryWithByProperties(
    filter: OrdersItemsRepositoryFilter,
  ): any {
    const query: Prisma.OrdersItemsWhereInput = {};

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
