import cors from "cors";
import Debug from "debug";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler, notFound } from "./middlewares";
const debug = Debug("server");

const initalizeApp = async (): Promise<express.Application> => {
  const app = express();

  // If we are behind some reverse proxy like Nginx then we can trust this
  app.enable("trust proxy");

  app.use(helmet());
  app.use(cors());
  app.use(morgan("common"));
  app.use(express.json());

  app.get("/", (_req: express.Request, res: express.Response) => {
    res
      .status(200)
      .json(`Server running at http://localhost:${process.env.PORT}`);
  });

  app.use(notFound);
  app.use(errorHandler);

  debug("App initalized....");
  return app;
};

export default initalizeApp;
