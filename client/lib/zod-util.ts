import { z } from "zod";

export function zodEnumFromPrismaEnum<T extends Record<string, string>>(e: T) {
  return z.enum(Object.values(e) as [T[keyof T], ...T[keyof T][]]); // To create a zod enum from prisma generated enum (Thanks GPT)
}
