import path from "path";

import dotenv from "dotenv";

import commandLineArgs from "command-line-args";

const config = () => {
  const options = commandLineArgs([
    {
      name: "env",
      alias: "e",
      defaultValue: "development",
      type: String,
    },
  ]);

  if (options.env !== "production") {
    return;
  }
  dotenv.config({
    path: path.join(__dirname, `env/${options.env}.env`),
  });
};

config();
