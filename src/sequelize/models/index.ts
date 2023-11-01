import Sequelize from "sequelize";

import config from "../config";
import * as Order from "./Order";
import * as Item from "./Item";

export interface ModelsInterface {
  Order: Order.OrderModel;
  Item: Item.ItemModel;
}

export interface DbInterface extends ModelsInterface {
  sequelize: Sequelize.Sequelize;
  Sequelize: Sequelize.SequelizeStatic;
}

const { database, username, password, ...params } = config;
const sequelize = new Sequelize(database, username, password, params);

const models: ModelsInterface = {
  Order: Order.OrderFactory(sequelize, Sequelize),
  Item: Item.ItemFactory(sequelize, Sequelize),
};

Object.keys(models).forEach((modelName: string) => {
  const model = models[modelName as keyof ModelsInterface];
  if (model && model.associate) {
    model.associate(models as any);
  }
});

const db: DbInterface & { [key: string]: any } = {
  sequelize,
  Sequelize,
  ...models,
};

export default db;