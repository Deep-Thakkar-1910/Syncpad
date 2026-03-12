type Room = {
  clients: Set<AuthedWebSocket>;
  users: Map<string, UserMeta>;
  connectionCounts: Map<string, number>;
  pendingRemovals: Map<string, NodeJS.Timeout>;
};
