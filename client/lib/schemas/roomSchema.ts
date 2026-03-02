import * as z from "zod";
import { zodEnumFromPrismaEnum } from "../zod-util";
import { Languages, RoomType } from "@/generated/prisma/enums";

export const RoomSchema = z.object({
  name: z
    .string()
    .min(3, "Room name cannot be less than 3 characters")
    .max(100, "Room name cannot be more than 100 characters"),
  type: zodEnumFromPrismaEnum(RoomType),
  language: zodEnumFromPrismaEnum(Languages),
});

export type RoomFormValues = z.infer<typeof RoomSchema>;
