import { Inject, Injectable } from '@nestjs/common';

import { OrdersDITokens } from '@core/orders/domain/di';
import {
  OrdersRepository,
  OrdersRepositoryInput,
} from '@core/orders/domain/port/repository';

import {
  UpdateOrdersSequelizeInputDto,
  UpdateOrdersSequelizeOutputDto,
} from '../dto';

@Injectable()
export class UpdateOrdersUseCase {
  constructor(
    @Inject(OrdersDITokens.OrdersRepository)
    private readonly repository: OrdersRepository,
  ) {}

  async execute(
    id: string,
    data: UpdateOrdersSequelizeInputDto,
  ): Promise<UpdateOrdersSequelizeOutputDto> {
    const payload = {} as OrdersRepositoryInput;

    if ('user' in data) {
      payload['user'] = data.user;
    }

    return this.repository.update(id, payload);
  }
}
