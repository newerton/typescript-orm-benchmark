import { Inject, Injectable } from '@nestjs/common';

import { OrdersDITokens } from '@core/orders/domain/di';
import { OrdersRepository } from '@core/orders/domain/port/repository';

@Injectable()
export class DeleteOrdersUseCase {
  constructor(
    @Inject(OrdersDITokens.OrdersRepository)
    private readonly repository: OrdersRepository,
  ) {}

  async execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
