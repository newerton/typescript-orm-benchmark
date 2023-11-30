import {
  serial,
  text,
  timestamp,
  pgTable,
  decimal,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const orders = pgTable('orders', {
	id: serial('id').primaryKey(),
  user: text('user'),
	date: timestamp('date').default(new Date()),
});
 
export const ordersRelations = relations(orders, ({ many }) => ({
	ordersToItems: many(ordersToItems),
}));
 
export const items = pgTable('items', {
	id: serial('id').primaryKey(),
	name: text('name'),
  value: decimal('value'),
});
 
export const itemsRelations = relations(items, ({ many }) => ({
	ordersToItems: many(ordersToItems),
}));
 
export const ordersToItems = pgTable('orders_items', {
		order_id: integer('order_id').notNull().references(() => orders.id),
		item_id: integer('item_id').notNull().references(() => items.id),
	}, (t) => ({
		pk: primaryKey(t.order_id, t.item_id),
	}),
);
 
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