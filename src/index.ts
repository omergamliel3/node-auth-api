import "./pre-start/index";
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
    logger.err(err, true);
    process.exit(1);
  });
