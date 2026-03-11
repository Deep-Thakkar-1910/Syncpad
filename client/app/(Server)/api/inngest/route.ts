import { serve } from "inngest/next";
import { inngest } from "./inngest-client";
import { deleteExpiredInvites } from "./expireInvite";

export const maxDuration = 300; // For security so inngest doesn't drain our compute.

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [deleteExpiredInvites],
});
