import { randomUUID } from 'crypto';

import { Items } from '@core/items/domain/entity';

import { TypeOrmItems } from '../Items';

export class TypeOrmItemsMapper {
  public static toOrmEntity(domain: Items): TypeOrmItems {
    const orm: TypeOrmItems = new TypeOrmItems();
    orm.id = randomUUID();
    orm.name = domain.name;
    orm.value = domain.value;
    return orm;
  }

  public static toOrmEntities(domainItemss: Items[]): TypeOrmItems[] {
    return domainItemss.map((domainItems) => this.toOrmEntity(domainItems));
  }

  public static toDomainEntity(orm: TypeOrmItems): Items {
    const domainItems: Items = new Items();
    domainItems.id = orm.id;
    domainItems.name = orm.name;
    domainItems.value = orm.value;
    return domainItems;
  }

  public static toDomainEntities(orms: TypeOrmItems[]): Items[] {
    return orms.map((orm) => this.toDomainEntity(orm));
  }
}
