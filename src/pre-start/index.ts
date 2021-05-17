import path from "path";

import dotenv from "dotenv";

import commandLineArgs from "command-line-args";
import { DEVELOPMENT, PRODUCTION } from "@shared/constants";

const config = () => {
  const options = commandLineArgs([
    {
      name: "env",
      alias: "e",
      defaultValue: DEVELOPMENT,
      type: String,
    },
  ]);

  if (options.env !== PRODUCTION) {
    return;
  }
  dotenv.config({
    path: path.join(__dirname, `env/${options.env}.env`),
  });
};

config();
