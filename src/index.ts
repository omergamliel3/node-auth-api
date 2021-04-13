import "./pre-start"; // Must be the first import
import { createDbConnection } from "@database";
import App from "@server";
import logger from "@shared/logger";

const port = Number(process.env.PORT || 3000);

createDbConnection()
  .then(() => {
    logger.info("DB connected");
    const app = new App(port);
    app.listen();
  })
  .catch((err) => {
    logger.err("Error connecting to DB");
    logger.err(err, true);
    process.exit(1);
  });
