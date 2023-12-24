import { Inject, Injectable } from '@nestjs/common';

import { OrdersDITokens } from '@core/orders/domain/di';
import { OrdersRepository } from '@core/orders/domain/port/repository';

import { FilterOrdersDrizzleDto, GetOneOrdersDrizzleOutputDto } from '../dto';

@Injectable()
export class GetOneOrdersUseCase {
  constructor(
    @Inject(OrdersDITokens.OrdersRepository)
    private readonly repository: OrdersRepository,
  ) {}

  async execute(filter: FilterOrdersDrizzleDto): Promise<GetOneOrdersDrizzleOutputDto> {
    return this.repository.findOne(filter);
  }
}
