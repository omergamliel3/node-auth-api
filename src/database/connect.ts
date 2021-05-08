import { createConnection, getConnection } from "typeorm";
import logger from "@shared/logger";
import User from "@entities/user";

// Run func when importing file
export const createDbConnection = async () => {
  try {
    // Checks for existing db connection
    const existingConnection = getConnection();
    if (existingConnection) {
      logger.info("Terminate staled connection");
      await existingConnection.close();
    }
  } catch (error) {
    logger.info("No DB existing connection");
  }

  // Create Postgres DB connection
  return createConnection({
    type: "postgres",
    host: process.env.HOST,
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
    // Entities are not registered this way
    //entities: [ '../orm/**' ],
    migrations: ["src/migration/**/*.ts"],
    synchronize: true,
    logging: false,
  });
};
