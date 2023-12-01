import { Inject, Injectable } from '@nestjs/common';

import { OrdersDITokens } from '@core/orders/domain/di';
import { OrdersRepository } from '@core/orders/domain/port/repository';

import { FilterOrdersDto, GetOneOrdersOutputDto } from '../dto';

@Injectable()
export class GetOneOrdersUseCase {
  constructor(
    @Inject(OrdersDITokens.OrdersRepository)
    private readonly repository: OrdersRepository,
  ) {}

  async execute(filter: FilterOrdersDto): Promise<GetOneOrdersOutputDto> {
    return this.repository.findOne(filter);
  }
}
