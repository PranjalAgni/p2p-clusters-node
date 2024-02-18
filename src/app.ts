import cors from "cors";
import Debug from "debug";
import path from "path";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import promClient from "prom-client";
import { errorHandler, notFound } from "./middlewares";
import { customMetric, jsonObjectMetric } from "./prometheusMetrics";
import {
  findNodeAddress,
  getAllSeedServer,
  getRandomSeedServer
} from "./utils/peers";
import { registerToSeedServer } from "./utils/register";
import { IMessageBody } from "./interface";
const debug = Debug("node:server");

const initalizeApp = async (nodeId: string): Promise<express.Application> => {
  // Enable collection of default metrics
  promClient.collectDefaultMetrics();
  const app = express();

  // If we are behind some reverse proxy like Nginx then we can trust this
  app.enable("trust proxy");

  app.use(helmet());
  app.use(cors());
  app.use(morgan("common"));
  app.use(express.json());

  const allSeedServers = await getAllSeedServer(
    path.join(__dirname, "seed.txt")
  );

  const randomSeedServer = getRandomSeedServer(allSeedServers);
  debug("Seed server for registeration: ", randomSeedServer);

  await registerToSeedServer({
    seedServerAddress: randomSeedServer,
    nodeId,
    nodeAddress: `http://localhost:${process.env.PORT}`
  });

  app.post("/message", async (req: express.Request, res: express.Response) => {
    const body = req.body as IMessageBody;
    if (!body.message || !body.toNode) {
      return res.status(400).send("Bad request");
    }

    debug("Request body: ", req.body);
    const toNodeAddress = await findNodeAddress({
      nodeId: body.toNode,
      seedServer: randomSeedServer
    });

    debug("To Node address: ", toNodeAddress);
    res.send(`OK: ${toNodeAddress}`);
  });

  app.get("/something", (req: express.Request, res: express.Response) => {
    // Increment the custom metric on each request
    customMetric.inc();
    // Simulate a JSON object as a metric value
    const jsonObjectValue = {
      key1: String(req.ip),
      key2: JSON.stringify(req.headers)
    };

    // Set the metric value
    jsonObjectMetric.inc(jsonObjectValue);
    res
      .status(200)
      .json(`Server running at http://localhost:${process.env.PORT}`);
  });

  app.get("/metrics", (req, res) => {
    // Expose Prometheus metrics endpoint
    res.setHeader("Content-Type", promClient.register.contentType);
    promClient.register.metrics().then((data) => res.send(data));
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default initalizeApp;
