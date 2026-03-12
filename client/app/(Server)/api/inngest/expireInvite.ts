import db from "@/lib/prisma";
import { inngest } from "./inngest-client";

export const deleteExpiredInvites = inngest.createFunction(
  {
    id: "delete-expired-invites",
    name: "Delete Expired Invites",
  },
  {
    cron: "0 * * * *",
  },
  async ({ step }) => {
    return await step.run("delete-expired-invites", async () => {
      try {
        const invites = await db.roomInvite.deleteMany({
          where: {
            expiresAt: {
              lt: new Date(),
            },
          },
        });
        return { removedInvites: invites.count };
      } catch (err) {
        if (err instanceof Error) {
          return err.stack;
        }
      }
    });
  },
);
