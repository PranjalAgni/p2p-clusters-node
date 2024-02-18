import Debug from "debug";
import fs from "fs/promises";
import { IFindNodeData, IMessageBody, NodeSearchResult } from "../interface";
const debug = Debug("seedserver:peers");

export const getAllSeedServer = async (
  seedFilePath: string
): Promise<string[]> => {
  const seedServers = await fs.readFile(seedFilePath, "utf8");
  const serversAddress = seedServers.split("\n");
  debug(`Seed servers: ${seedServers}`);
  return serversAddress;
};

export const getRandomSeedServer = (seedServers: string[]) => {
  const randomIdx = Math.floor(Math.random() * seedServers.length);
  return seedServers[randomIdx];
};

export const findNodeAddress = async ({
  nodeId,
  seedServer,
  requestorNode,
  metadata = ""
}: IFindNodeData): Promise<NodeSearchResult> => {
  debug("Find node address: ", { nodeId, seedServer, requestorNode });
  const URL = `${seedServer}/search?nodeId=${nodeId}`;
  const response = await fetch(URL, {
    headers: {
      "X-REQ-NODE": requestorNode,
      "X-METADATA": metadata
    }
  });
  if (response.ok) {
    debug("Yay found something");
    const address = await response.text();
    const updatedmetadata = response.headers.get("X-REQ-FLOW");
    return {
      found: true,
      address,
      message: "Found the address",
      metadata: updatedmetadata.split(",")
    };
  } else {
    debug("Ohh no cannot find address");
  }

  return {
    found: false,
    address: null,
    message: await response.text(),
    metadata: metadata.split(",")
  };
};

export const sendMessageToNode = async (
  data: IMessageBody,
  fromNode: string
) => {
  return await fetch(`${data.toNode}/got`, {
    method: "POST",
    body: JSON.stringify({
      message: data.message,
      fromNode
    }),
    headers: {
      "content-type": "application/json"
    }
  });
};
