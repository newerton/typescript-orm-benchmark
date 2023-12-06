import { pgTable, real, uuid, varchar } from 'drizzle-orm/pg-core';

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  user: varchar('user'),
  created_at: varchar('created_at'),
});

export const items = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name'),
  value: real('value'),
});
