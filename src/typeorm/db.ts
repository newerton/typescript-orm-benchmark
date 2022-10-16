import { DataSource, Repository } from "typeorm";

import { Order as OrderEntity } from "./entities/Order";
import { Item as ItemEntity } from "./entities/Item";

import config from "./config";

export type Repositories = {
  ItemRepository: Repository<ItemEntity>;
  OrderRepository: Repository<OrderEntity>;
};

export const AppDataSource = new DataSource(config);

export async function initRepositories(): Promise<Repositories> {
  AppDataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });

  return {
    ItemRepository: AppDataSource.getRepository(ItemEntity),
    OrderRepository: AppDataSource.getRepository(OrderEntity),
  };
}
