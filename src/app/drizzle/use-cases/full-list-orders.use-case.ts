import { Inject, Injectable } from '@nestjs/common';

import { OrdersDITokens } from '@core/orders/domain/di';
import { OrdersRepository } from '@core/orders/domain/port/repository';

import { FilterOrdersDrizzleDto, FullListOrdersDrizzleOutputDto } from '../dto';

@Injectable()
export class FullListOrdersUseCase {
  constructor(
    @Inject(OrdersDITokens.OrdersRepository)
    private readonly repository: OrdersRepository,
  ) {}

  async execute(filter: FilterOrdersDrizzleDto): Promise<FullListOrdersDrizzleOutputDto[]> {
    return this.repository.findFull(filter);
  }
}
