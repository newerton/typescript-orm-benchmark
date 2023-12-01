import { Inject, Injectable } from '@nestjs/common';

import { OrdersDITokens } from '@core/orders/domain/di';
import {
  OrdersRepository,
  OrdersRepositoryOutput,
} from '@core/orders/domain/port/repository';

import { CreateOrdersInputDto } from '../dto';

@Injectable()
export class CreateOrdersUseCase {
  constructor(
    @Inject(OrdersDITokens.OrdersRepository)
    private readonly repository: OrdersRepository,
  ) {}

  async execute(
    payload: CreateOrdersInputDto,
  ): Promise<OrdersRepositoryOutput> {
    return this.repository.create(payload);
  }
}
