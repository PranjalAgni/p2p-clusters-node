import cors from "cors";
import Debug from "debug";
import path from "path";
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler, notFound } from "./middlewares";
import { findNodeAddress, getAllSeedServer } from "./utils/peers";
const debug = Debug("seedserver");

const seedId = process.env.ID;

const knownMap = new Map<string, string>();

const startup = async () => {
  const app = express();
  // If we are behind some reverse proxy like Nginx then we can trust this
  app.enable("trust proxy");
  app.use(helmet());
  app.use(cors());
  app.use(morgan("common"));
  app.use(express.json());

  // read all seed servers
  const allSeedServers = await getAllSeedServer(
    path.join(__dirname, "seed.txt")
  );

  const peerSeedServers = allSeedServers.filter(
    (serverAddress) => !serverAddress.includes(process.env.PORT)
  );

  debug("Peer seed servers: ", peerSeedServers);

  app.get("/register", (req: Request, res: Response) => {
    const queryData = req.query;
    debug("Query params: ", queryData);
    const nodeId = req.query?.nodeId as string;
    const address = req.query?.address as string;
    if (!nodeId || !address) {
      return res.status(400).send("Bad Request ❌");
    }

    knownMap.set(nodeId, address);
    res.status(200).send("OK ✅");
  });

  app.get("/search", async (req: Request, res: Response) => {
    const nodeId = req.query?.nodeId as string;
    if (!nodeId) {
      return res.status(400).send("Bad Request ❌");
    }

    if (knownMap.has(nodeId)) {
      return res.status(200).send(knownMap.get(nodeId));
    }

    // if not in known list than find in peer list
    for (const peerServer of peerSeedServers) {
      const address = await findNodeAddress({
        nodeId,
        seedServer: peerServer
      });
      if (address) {
        knownMap.set(nodeId, address);
        return res.status(200).send(knownMap.get(address));
      }
    }

    res
      .status(500)
      .send("Ohh I asked all seed nodes but couldn't find the address");
  });

  app.use(notFound);
  app.use(errorHandler);

  app.listen(parseInt(process.env.PORT, 10), () => {
    debug(
      `${seedId} running at http://localhost:${process.env.PORT} in ${process.env.NODE_ENV} mode`
    );
  });
};

startup();
