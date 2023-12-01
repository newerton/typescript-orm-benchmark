import { randomUUID } from 'crypto';

import { Orders } from '@core/orders/domain/entity';

import { TypeOrmOrders } from '../Orders';

export class TypeOrmOrdersMapper {
  public static toOrmEntity(domain: Orders): TypeOrmOrders {
    const orm: TypeOrmOrders = new TypeOrmOrders();
    orm.id = randomUUID();
    orm.user = domain.user;
    orm.created_at = new Date();
    return orm;
  }

  public static toOrmEntities(domainOrderss: Orders[]): TypeOrmOrders[] {
    return domainOrderss.map((domainOrders) => this.toOrmEntity(domainOrders));
  }

  public static toDomainEntity(orm: TypeOrmOrders): Orders {
    const domainOrders: Orders = new Orders();
    domainOrders.id = orm.id;
    domainOrders.user = orm.user;
    domainOrders.created_at = orm.created_at;
    return domainOrders;
  }

  public static toDomainEntities(orms: TypeOrmOrders[]): Orders[] {
    return orms.map((orm) => this.toDomainEntity(orm));
  }
}
