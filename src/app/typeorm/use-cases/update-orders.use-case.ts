import { Inject, Injectable } from '@nestjs/common';

import { OrdersDITokens } from '@core/orders/domain/di';
import {
  OrdersRepository,
  OrdersRepositoryInput,
} from '@core/orders/domain/port/repository';

import { UpdateOrdersInputDto, UpdateOrdersOutputDto } from '../dto';

@Injectable()
export class UpdateOrdersUseCase {
  constructor(
    @Inject(OrdersDITokens.OrdersRepository)
    private readonly repository: OrdersRepository,
  ) {}

  async execute(
    id: string,
    data: UpdateOrdersInputDto,
  ): Promise<UpdateOrdersOutputDto> {
    const payload = {} as OrdersRepositoryInput;

    if ('user' in data) {
      payload['user'] = data.user;
    }

    return this.repository.update(id, payload);
  }
}
