export interface IMessageBody {
  message: string;
  toNode: string;
}

export interface NodeSearchResult {
  found: boolean;
  address: string | null;
  message: string;
  metadata: string[];
}

export interface IFindNodeData {
  nodeId: string;
  seedServer: string;
  requestorNode: string;
  metadata?: string;
}
