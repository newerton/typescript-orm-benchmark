import { randomUUID } from 'crypto';

import { Items } from '@core/items/domain/entity';

import { SequelizeItems } from '../Items.entity';

export class SequelizeItemsMapper {
  public static toOrmEntity(domain: Items): SequelizeItems {
    const orm: SequelizeItems = new SequelizeItems();
    orm.id = randomUUID();
    orm.name = domain.name;
    orm.value = domain.value;
    return orm;
  }

  public static toOrmEntities(domainItemss: Items[]): SequelizeItems[] {
    return domainItemss.map((domainItems) => this.toOrmEntity(domainItems));
  }

  public static toDomainEntity(orm: SequelizeItems): Items {
    const domainItems: Items = new Items();
    domainItems.id = orm.id;
    domainItems.name = orm.name;
    domainItems.value = orm.value;
    return domainItems;
  }

  public static toDomainEntities(orms: SequelizeItems[]): Items[] {
    return orms.map((orm) => this.toDomainEntity(orm));
  }
}
