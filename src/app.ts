import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import redis from "redis";
import { promisifyAll } from "bluebird";

import { currentConfig as config } from "./config/index";
import { handleError, NotFoundError } from "./util/httpError";

import { authRouter } from "./routes/routeIndex";
import { logger } from "./util/logger";
import { createTypeOrmConnection } from "./util/typeOrmConnection";

dotenv.config();

const app: Application = express();
const PORT = config.app.port || 8030;

promisifyAll(redis);

// parse requests of content-type: application/json
app.use(express.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) =>
  res.send("<h1>jott AUTH Service v1.0 🔒</h1>")
);

app.use("/api/v1/auth", authRouter);

//app-wide custom error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  handleError(error, res, next);
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    logger.info(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  });
}

export { app };
