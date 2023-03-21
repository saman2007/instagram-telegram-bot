import dotenv from "dotenv";

import path from "path";

const devMode = process.env.NODE_ENV === "development";

dotenv.config({
  path: devMode
    ? path.resolve(__dirname, "..", "configs", "config.env")
    : path.resolve(__dirname, "configs", "config.env"),
});
