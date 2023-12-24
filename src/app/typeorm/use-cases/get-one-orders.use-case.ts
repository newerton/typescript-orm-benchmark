import { Inject, Injectable } from '@nestjs/common';

import { OrdersDITokens } from '@core/orders/domain/di';
import { OrdersRepository } from '@core/orders/domain/port/repository';

import { FilterOrdersTypeOrmDto, GetOneOrdersTypeOrmOutputDto } from '../dto';

@Injectable()
export class GetOneOrdersUseCase {
  constructor(
    @Inject(OrdersDITokens.OrdersRepository)
    private readonly repository: OrdersRepository,
  ) {}

  async execute(filter: FilterOrdersTypeOrmDto): Promise<GetOneOrdersTypeOrmOutputDto> {
    return this.repository.findOne(filter);
  }
}
