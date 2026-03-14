import { z } from "zod";
import { databaseIdSchema } from "@/lib/validations/database-id";

const nodeStatusSchema = z.enum(["online", "degraded", "offline", "maintenance"]);

export const createNodeSchema = z.object({
  availabilityPct: z.coerce
    .number()
    .min(0, "Availability must be at least 0.")
    .max(100, "Availability must be at most 100."),
  name: z.string().trim().min(2, "Node name is required."),
  networkSlice: z.string().trim().min(2, "Network slice is required."),
  nodeType: z.string().trim().min(2, "Node type is required."),
  region: z.string().trim().min(2, "Region is required."),
  siteCode: z.string().trim().min(3, "Site code is required."),
  softwareVersion: z.string().trim().min(1, "Software version is required."),
  status: nodeStatusSchema,
  vendor: z.string().trim().min(2, "Vendor is required."),
});

export const updateNodeSchema = z.object({
  availabilityPct: z.coerce
    .number()
    .min(0, "Availability must be at least 0.")
    .max(100, "Availability must be at most 100."),
  nodeId: databaseIdSchema,
  status: nodeStatusSchema,
});

export const deleteNodeSchema = z.object({
  nodeId: databaseIdSchema,
});
