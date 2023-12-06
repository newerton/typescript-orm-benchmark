import { randomUUID } from 'crypto';

import { Orders } from '@core/orders/domain/entity';

import { SequelizeOrders } from '../Orders.entity';

export class SequelizeOrdersMapper {
  public static toOrmEntity(domain: Orders): SequelizeOrders {
    const orm: SequelizeOrders = new SequelizeOrders();
    orm.id = randomUUID();
    orm.user = domain.user;
    orm.created_at = new Date();
    return orm;
  }

  public static toOrmEntities(domainOrderss: Orders[]): SequelizeOrders[] {
    return domainOrderss.map((domainOrders) => this.toOrmEntity(domainOrders));
  }

  public static toDomainEntity(orm: SequelizeOrders): Orders {
    const domainOrders: Orders = new Orders();
    domainOrders.id = orm.id;
    domainOrders.user = orm.user;
    domainOrders.created_at = orm.created_at;
    return domainOrders;
  }

  public static toDomainEntities(orms: SequelizeOrders[]): Orders[] {
    return orms.map((orm) => this.toDomainEntity(orm));
  }
}
