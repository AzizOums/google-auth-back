import "dotenv/config";

import express, { Application } from "express";
import session from "express-session";
import cors from "cors";

import routes from "./routes";
import { options } from "./service/redis";
import { notFound, errorHandler, sessionHandler } from "./middlewares";

const app: Application = express();

const init = async () => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(session(options));
  app.use(sessionHandler);
  app.use("/api", routes());
  app.use(notFound);
  app.use(errorHandler);
};

init();
export default app;
