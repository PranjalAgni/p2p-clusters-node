import Debug from "debug";
import fs from "fs/promises";
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
  seedServer
}: {
  nodeId: string;
  seedServer: string;
}): Promise<string | null> => {
  const URL = `${seedServer}/search?nodeId=${nodeId}`;
  const response = await fetch(URL);
  if (response.ok) {
    debug("Yay found something");
    const address = await response.text();
    return address;
  } else {
    debug("Ohh no cannot find address");
  }

  return null;
};
