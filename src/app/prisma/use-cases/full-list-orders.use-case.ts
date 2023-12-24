import { Inject, Injectable } from '@nestjs/common';

import { OrdersDITokens } from '@core/orders/domain/di';
import { OrdersRepository } from '@core/orders/domain/port/repository';

import { FilterOrdersPrismaDto, FullListOrdersPrismaOutputDto } from '../dto';

@Injectable()
export class FullListOrdersUseCase {
  constructor(
    @Inject(OrdersDITokens.OrdersRepository)
    private readonly repository: OrdersRepository,
  ) {}

  async execute(filter: FilterOrdersPrismaDto): Promise<FullListOrdersPrismaOutputDto[]> {
    return this.repository.findFull(filter);
  }
}
