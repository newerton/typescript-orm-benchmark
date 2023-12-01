import { Inject, Injectable } from '@nestjs/common';

import { OrdersDITokens } from '@core/orders/domain/di';
import { OrdersRepository } from '@core/orders/domain/port/repository';

import { FilterOrdersDto, FullListOrdersOutputDto } from '../dto';

@Injectable()
export class FullListOrdersUseCase {
  constructor(
    @Inject(OrdersDITokens.OrdersRepository)
    private readonly repository: OrdersRepository,
  ) {}

  async execute(filter: FilterOrdersDto): Promise<FullListOrdersOutputDto[]> {
    return this.repository.findFull(filter);
  }
}
