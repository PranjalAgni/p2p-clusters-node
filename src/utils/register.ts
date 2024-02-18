import Debug from "debug";
const debug = Debug("node:register");

export const registerToSeedServer = async ({
  seedServerAddress,
  nodeId,
  nodeAddress
}: {
  seedServerAddress: string;
  nodeId: string;
  nodeAddress: string;
}) => {
  const URL = `${seedServerAddress}/register?nodeId=${nodeId}&address=${nodeAddress}`;
  const response = await fetch(URL);
  if (response.ok) {
    debug("Successfully registered nodeId ", nodeId);
  } else {
    debug("Can't register nodeId ", nodeId);
  }
};
