import { serve } from "inngest/next";
import { inngest } from "./inngest-client";
import { deleteExpiredInvites } from "./expireInvite";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [deleteExpiredInvites],
});
