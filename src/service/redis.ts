import { createClient } from "redis";
import session from "express-session";
import connectRedis from "connect-redis";

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
const domain = process.env.SESSION_DOMAIN as string;

export const cookie = { domain, path: "/" };

export const store = new RedisStore(redisConfig);

export const options = {
  secret,
  store,
  name: "_session",
  saveUninitialized: true,
  resave: false,
};
