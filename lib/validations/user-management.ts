import { z } from "zod";
import { databaseIdSchema } from "@/lib/validations/database-id";

export const updateUserRoleSchema = z.object({
  role: z.enum(["admin", "operator", "viewer"]),
  userId: databaseIdSchema,
});

export const updateUserStatusSchema = z.object({
  nextIsActive: z.enum(["true", "false"]),
  userId: databaseIdSchema,
});
