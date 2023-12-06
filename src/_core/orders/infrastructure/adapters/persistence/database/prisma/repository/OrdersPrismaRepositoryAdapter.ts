import { Prisma, PrismaClient } from '@prisma/client';

import { Code } from '@core/@shared/domain/error';
import { Exception } from '@core/@shared/domain/exception';
import { prisma } from '@core/@shared/infrastructure/adapters/persistence/database/prisma';
import {
  OrdersRepository,
  OrdersRepositoryCountOutput,
  OrdersRepositoryFilter,
  OrdersRepositoryInput,
  OrdersRepositoryOutput,
} from '@core/orders/domain/port/repository';

export class OrdersPrismaRepositoryAdapter implements OrdersRepository {
  constructor(private model: PrismaClient['orders']) {}

  async create(entity: OrdersRepositoryInput): Promise<OrdersRepositoryOutput> {
    const model: Prisma.OrdersCreateInput = {
      user: entity.user,
    };

    try {
      const response = await this.model.create({
        data: model,
      });
      return response;
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: `Error creating Orders`,
        data: error,
      });
    }
  }

  async findAll(
    page: number,
    limit: number,
    filter: OrdersRepositoryFilter,
  ): Promise<OrdersRepositoryCountOutput> {
    const where = this.extendQueryWithByProperties(filter);

    const skip = limit * (page - 1);
    const take = limit;
    const [data, count] = await prisma.$transaction([
      this.model.findMany({
        where,
        include: { ordersItems: { include: { items: true } } },
        orderBy: { created_at: 'desc' },
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
    filter: OrdersRepositoryFilter,
  ): Promise<OrdersRepositoryOutput[]> {
    const where = this.extendQueryWithByProperties(filter);

    return this.model.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(
    filter: OrdersRepositoryFilter,
  ): Promise<OrdersRepositoryOutput> {
    const where = this.extendQueryWithByProperties(filter);
    return this.model.findFirst({
      where,
      include: { ordersItems: { include: { items: true } } },
    });
  }

  async update(
    id: string,
    payload: OrdersRepositoryInput,
  ): Promise<OrdersRepositoryOutput> {
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
        overrideMessage: `Error updating Orders`,
        data: error,
      });
    }
  }

  async delete(id: string) {
    await this._get(id);
    return this.model.delete({ where: { id } });
  }

  async deleteMany(filter: OrdersRepositoryFilter): Promise<any> {
    const newFilter = {
      user: filter.user,
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
        overrideMessage: `Orders not found`,
      });
    }
    return model;
  }

  private extendQueryWithByProperties(filter: OrdersRepositoryFilter): any {
    const query: Prisma.OrdersWhereInput = {};

    if (filter) {
      if ('id' in filter) {
        query.id = filter.id;
      }

      if ('user' in filter) {
        query.user = {
          contains: filter.user,
          mode: 'insensitive',
        };
      }
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
