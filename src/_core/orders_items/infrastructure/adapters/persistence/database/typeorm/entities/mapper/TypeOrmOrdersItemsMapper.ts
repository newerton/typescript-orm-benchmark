import { randomUUID } from 'crypto';

import { OrdersItems } from '@core/orders_items/domain/entity';

import { TypeOrmOrdersItems } from '../OrdersItems';

export class TypeOrmOrdersItemsMapper {
  public static toOrmEntity(domain: OrdersItems): TypeOrmOrdersItems {
    const orm: TypeOrmOrdersItems = new TypeOrmOrdersItems();
    orm.id = randomUUID();
    orm.order_id = domain.order_id;
    orm.item_id = domain.item_id;
    return orm;
  }

  public static toOrmEntities(
    domainOrdersItems: OrdersItems[],
  ): TypeOrmOrdersItems[] {
    return domainOrdersItems.map((domainOrdersItems) =>
      this.toOrmEntity(domainOrdersItems),
    );
  }

  public static toDomainEntity(orm: TypeOrmOrdersItems): OrdersItems {
    const domainOrdersItems: OrdersItems = new OrdersItems();
    domainOrdersItems.id = orm.id;
    domainOrdersItems.order_id = orm.order_id;
    domainOrdersItems.item_id = orm.item_id;
    return domainOrdersItems;
  }

  public static toDomainEntities(orms: TypeOrmOrdersItems[]): OrdersItems[] {
    return orms.map((orm) => this.toDomainEntity(orm));
  }
}
