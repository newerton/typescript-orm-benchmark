import { Inject, Injectable } from '@nestjs/common';

import { OrdersDITokens } from '@core/orders/domain/di';
import { OrdersRepository } from '@core/orders/domain/port/repository';

import { FilterOrdersTypeOrmDto, FullListOrdersTypeOrmOutputDto } from '../dto';

@Injectable()
export class FullListOrdersUseCase {
  constructor(
    @Inject(OrdersDITokens.OrdersRepository)
    private readonly repository: OrdersRepository,
  ) {}

  async execute(filter: FilterOrdersTypeOrmDto): Promise<FullListOrdersTypeOrmOutputDto[]> {
    return this.repository.findFull(filter);
  }
}
