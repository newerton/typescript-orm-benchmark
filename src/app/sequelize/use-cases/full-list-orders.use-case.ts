import { Inject, Injectable } from '@nestjs/common';

import { OrdersDITokens } from '@core/orders/domain/di';
import { OrdersRepository } from '@core/orders/domain/port/repository';

import { FilterOrdersSequelizeDto, FullListOrdersSequelizeOutputDto } from '../dto';

@Injectable()
export class FullListOrdersUseCase {
  constructor(
    @Inject(OrdersDITokens.OrdersRepository)
    private readonly repository: OrdersRepository,
  ) {}

  async execute(filter: FilterOrdersSequelizeDto): Promise<FullListOrdersSequelizeOutputDto[]> {
    return this.repository.findFull(filter);
  }
}
