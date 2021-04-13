import "./pre-start"; // Must be the first import
import { createDbConnection } from "@database";
import app from "@server";
import logger from "@shared/logger";

const port = Number(process.env.PORT || 3000);

createDbConnection()
  .then(() => {
    app.listen(port, () => {
      logger.info("Express server started on port: " + port);
    });
  })
  .catch((err) => {
    logger.err("Error connecting to DB");
    logger.err(err, true);
    process.exit(1);
  });
