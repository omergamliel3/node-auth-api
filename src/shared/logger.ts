/**
 * Setup the jet-logger.
 *
 * Documentation: https://github.com/seanpmaxwell/jet-logger
 */

import Logger, { LoggerModes } from "jet-logger";

const logger = new Logger();
if (process.env.NODE_ENV === "production") {
  logger.mode = LoggerModes.File;
}

export default logger;
