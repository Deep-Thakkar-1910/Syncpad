import { RoomType } from "@/generated/prisma/enums";

export const RoomTypeLabel: Record<RoomType, string> = {
  SINGLE: "Single File",
  MULTI: "Multi File",
};
