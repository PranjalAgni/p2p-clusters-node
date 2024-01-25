import cors from "cors";
import Debug from "debug";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import promClient from "prom-client";
import { errorHandler, notFound } from "./middlewares";
import { customMetric, jsonObjectMetric } from "./prometheusMetrics";
const debug = Debug("server");

const initalizeApp = async (): Promise<express.Application> => {
  // Enable collection of default metrics
  promClient.collectDefaultMetrics();

  const app = express();

  // If we are behind some reverse proxy like Nginx then we can trust this
  app.enable("trust proxy");

  app.use(helmet());
  app.use(cors());
  app.use(morgan("common"));
  app.use(express.json());

  app.get("/", (req: express.Request, res: express.Response) => {
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

  debug("App initalized....");
  return app;
};

export default initalizeApp;
