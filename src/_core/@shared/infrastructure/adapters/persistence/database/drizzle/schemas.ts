import { randomUUID } from 'crypto';

import { relations } from 'drizzle-orm';
import { pgTable, real, uuid, varchar } from 'drizzle-orm/pg-core';

export const orders = pgTable('orders', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  user: varchar('user'),
  created_at: varchar('created_at').default(new Date().toISOString()),
});

export const ordersRelations = relations(orders, ({ many }) => ({
  ordersToItems: many(ordersToItems),
}));

export const items = pgTable('items', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: varchar('name'),
  value: real('value'),
});

export const itemsRelations = relations(items, ({ many }) => ({
  ordersToItems: many(ordersToItems),
}));

export const ordersToItems = pgTable('orders_items', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  order_id: uuid('order_id')
    .notNull()
    .references(() => orders.id),
  item_id: uuid('item_id')
    .notNull()
    .references(() => items.id),
});

export const ordersToItemsRelations = relations(ordersToItems, ({ one }) => ({
  item: one(items, {
    fields: [ordersToItems.item_id],
    references: [items.id],
  }),
  order: one(orders, {
    fields: [ordersToItems.order_id],
    references: [orders.id],
  }),
}));
