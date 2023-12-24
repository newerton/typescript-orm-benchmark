import { Inject, Injectable } from '@nestjs/common';

import { OrdersDITokens } from '@core/orders/domain/di';
import { OrdersRepository } from '@core/orders/domain/port/repository';

import { FilterOrdersSequelizeDto, ListAllOrdersPagedOutputDto } from '../dto';

@Injectable()
export class ListAllOrdersUseCase {
  constructor(
    @Inject(OrdersDITokens.OrdersRepository)
    private readonly repository: OrdersRepository,
  ) {}

  async execute(
    filter: FilterOrdersSequelizeDto,
    queryPage = 1,
  ): Promise<ListAllOrdersPagedOutputDto> {
    const page = (queryPage && Number(queryPage)) || 1;
    const limit = 100;
    const { data, count } = await this.repository.findAll(page, limit, filter);

    return {
      data,
      count,
      page,
      limit,
    };
  }
}
