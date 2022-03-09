import "dotenv/config";

import express, { Application } from "express";
import session from "express-session";
import cors from "cors";

import { createClient } from "redis";
import connectRedis from "connect-redis";

import routes from "./routes";
import { notFound, errorHandling, sessionHandler } from "./middlewares";

const app: Application = express();

const RedisStore = connectRedis(session);
const client = createClient({ host: "localhost", port: 6379 });

client.on("error", (err: Error) =>
  console.log("Could not establish a connection with redis. " + err)
);

client.on("connect", () => console.log("Connected to redis successfully"));

const redisConfig = {
  host: "localhost",
  port: 6379,
  ttl: 43200,
  client,
};
const secret = process.env.SESSION_SECRET as string;
const store = new RedisStore(redisConfig);

const init = async () => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    session({
      secret,
      store,
      name: "_session",
      saveUninitialized: true,
      resave: false,
    })
  );
  app.use(sessionHandler);
  app.use("/api", routes());
  app.use(notFound);
  app.use(errorHandling);
};

init();
export default app;
