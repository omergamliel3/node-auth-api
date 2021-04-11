import { createConnection } from "typeorm";
import logger from "@shared/logger";

// Run func when importing file
const start = async () => {
  try {
    // Checks for existing db connection ?
    // const existingConnection = getConnection();
    // if (existingConnection) {
    //   logger.info("Terminate staled connection");
    //   await existingConnection.close();
    // }

    // Create Postgres DB connection
    createConnection({
      type: "postgres",
      host: process.env.HOST,
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ["src/orm/*.ts"],
      synchronize: true,
      logging: false,
    }).then(() => {
      logger.info("Start Postgres DB connection");
    });
  } catch (error) {
    logger.err(error, true);
    process.exit(1);
  }
};

start();
