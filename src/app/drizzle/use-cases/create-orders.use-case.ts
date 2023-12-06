import { Inject, Injectable } from '@nestjs/common';

import { ItemsDITokens } from '@core/items/domain/di';
import { ItemsRepository } from '@core/items/domain/port/repository';
import { OrdersDITokens } from '@core/orders/domain/di';
import {
  OrdersRepository,
  OrdersRepositoryOutput,
} from '@core/orders/domain/port/repository';
import { OrdersItemsDITokens } from '@core/orders_items/domain/di';
import { OrdersItemsRepository } from '@core/orders_items/domain/port/repository';

import { CreateOrdersInputDto } from '../dto';

@Injectable()
export class CreateOrdersUseCase {
  constructor(
    @Inject(OrdersDITokens.OrdersRepository)
    private readonly orderRepository: OrdersRepository,

    @Inject(ItemsDITokens.ItemsRepository)
    private readonly itemRepository: ItemsRepository,

    @Inject(OrdersItemsDITokens.OrdersItemsRepository)
    private readonly orderItemRepository: OrdersItemsRepository,
  ) {}

  async execute(
    payload: CreateOrdersInputDto,
  ): Promise<OrdersRepositoryOutput> {
    const order = await this.orderRepository.create(payload);

    for (const items of payload.items) {
      const item = await this.itemRepository.create(items);
      await this.orderItemRepository.create({
        order_id: order.id,
        item_id: item.id,
      });
    }

    return this.orderRepository.findOne({ id: order.id });
  }
}
