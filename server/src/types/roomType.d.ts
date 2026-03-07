type Room = {
  clients: Set<AuthedWebSocket>;
  users: Map<string, UserMeta>;
};
