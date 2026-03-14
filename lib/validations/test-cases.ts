import { z } from "zod";
import { databaseIdSchema } from "@/lib/validations/database-id";

const metricTypeSchema = z.enum([
  "latency_ms",
  "throughput_mbps",
  "packet_loss_pct",
  "jitter_ms",
]);
const passConditionSchema = z.enum(["lte", "gte"]);

export const createTestCaseSchema = z.object({
  category: z.string().trim().min(2, "Category is required."),
  description: z.string().trim().min(10, "Description must be at least 10 characters."),
  estimatedDurationSeconds: z.coerce
    .number()
    .int("Estimated duration must be a whole number.")
    .min(30, "Estimated duration must be at least 30 seconds."),
  name: z.string().trim().min(3, "Test case name is required."),
  passCondition: passConditionSchema,
  passThreshold: z.coerce.number(),
  slug: z
    .string()
    .trim()
    .min(3, "Slug is required.")
    .regex(/^[a-z0-9-]+$/, "Slug can only include lowercase letters, numbers, and hyphens."),
  targetMetric: metricTypeSchema,
});

export const updateTestCaseSchema = z.object({
  isActive: z.coerce.boolean(),
  passCondition: passConditionSchema,
  passThreshold: z.coerce.number(),
  testCaseId: databaseIdSchema,
});

export const deleteTestCaseSchema = z.object({
  testCaseId: databaseIdSchema,
});
