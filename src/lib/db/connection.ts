import "reflect-metadata"
import { DataSource, DataSourceOptions } from "typeorm";

import * as Entities from "./entities/index";

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  cache: false,
  entities: Object.values(Entities)
}
const AppDataSource = new DataSource(dataSourceOptions)

export const connectToDatabase = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
};