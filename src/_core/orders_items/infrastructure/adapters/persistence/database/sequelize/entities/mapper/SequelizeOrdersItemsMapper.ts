import { randomUUID } from 'crypto';

import { OrdersItems } from '@core/orders_items/domain/entity';

import { SequelizeOrdersItems } from '../OrdersItems.entity';

export class SequelizeOrdersItemsMapper {
  public static toOrmEntity(domain: OrdersItems): SequelizeOrdersItems {
    const orm: SequelizeOrdersItems = new SequelizeOrdersItems();
    orm.id = randomUUID();
    orm.order_id = domain.order_id;
    orm.item_id = domain.item_id;
    return orm;
  }

  public static toOrmEntities(
    domainOrdersItems: OrdersItems[],
  ): SequelizeOrdersItems[] {
    return domainOrdersItems.map((domainOrdersItems) =>
      this.toOrmEntity(domainOrdersItems),
    );
  }

  public static toDomainEntity(orm: SequelizeOrdersItems): OrdersItems {
    const domainOrdersItems: OrdersItems = new OrdersItems();
    domainOrdersItems.id = orm.id;
    domainOrdersItems.order_id = orm.order_id;
    domainOrdersItems.item_id = orm.item_id;
    return domainOrdersItems;
  }

  public static toDomainEntities(orms: SequelizeOrdersItems[]): OrdersItems[] {
    return orms.map((orm) => this.toDomainEntity(orm));
  }
}
