import { RoomRole } from "@/generated/prisma/enums";

export const RoleLabel: Record<RoomRole, string> = {
  OWNER: "Owner",
  MEMBER: "Member",
};
