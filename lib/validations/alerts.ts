import { z } from "zod";

const alertSeveritySchema = z.enum(["critical", "warning", "info"]);
const alertStatusSchema = z.enum(["open", "resolved"]);
const metricTypeSchema = z.enum([
  "latency_ms",
  "throughput_mbps",
  "packet_loss_pct",
  "jitter_ms",
]);
const uuidSchema = z.string().uuid("Invalid identifier.");

function createNumberFieldSchema(label: string) {
  return z.preprocess(
    (value) => (value === null ? "" : value),
    z
      .string()
      .trim()
      .min(1, `${label} is required.`)
      .refine((value) => Number.isFinite(Number(value)), `${label} must be a valid number.`)
      .transform((value) => Number(value))
      .refine((value) => value >= 0, `${label} must be 0 or greater.`),
  );
}

export const createAlertSchema = z.object({
  currentValue: createNumberFieldSchema("Current value"),
  metricType: metricTypeSchema,
  nodeId: uuidSchema,
  severity: alertSeveritySchema,
  summary: z.string().trim().min(8, "Summary must be at least 8 characters."),
  thresholdValue: createNumberFieldSchema("Threshold value"),
  title: z.string().trim().min(4, "Title must be at least 4 characters."),
});

export const updateAlertStatusSchema = z.object({
  alertId: uuidSchema,
  status: alertStatusSchema,
});

export const deleteAlertSchema = z.object({
  alertId: uuidSchema,
});
