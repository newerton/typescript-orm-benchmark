import "dotenv/config";

import path from "path";
import { DataSourceOptions } from "typeorm";

const configuration: DataSourceOptions = {
  type: "postgres",
  port: +(process.env.DB_PORT || 5432),
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [path.resolve(__dirname, "./entities/*")],
  logging: true,
};

export default configuration;
