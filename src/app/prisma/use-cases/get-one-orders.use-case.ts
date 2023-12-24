import { Inject, Injectable } from '@nestjs/common';

import { OrdersDITokens } from '@core/orders/domain/di';
import { OrdersRepository } from '@core/orders/domain/port/repository';

import { FilterOrdersPrismaDto, GetOneOrdersPrismaOutputDto } from '../dto';

@Injectable()
export class GetOneOrdersUseCase {
  constructor(
    @Inject(OrdersDITokens.OrdersRepository)
    private readonly repository: OrdersRepository,
  ) {}

  async execute(filter: FilterOrdersPrismaDto): Promise<GetOneOrdersPrismaOutputDto> {
    return this.repository.findOne(filter);
  }
}
