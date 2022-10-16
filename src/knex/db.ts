import Knex, {Knex as KnexOrigin} from "knex";
import knexStringcase from "knex-stringcase";

import * as knexConfig from "./config";

export type Transaction = KnexOrigin.Transaction;

export const knex = Knex(knexStringcase(knexConfig));

export const TABLES: { [key: string]: string } = {
  ORDER: "orders",
  ITEM: "items",
  ORDER_ITEM: "orders_items",
};
