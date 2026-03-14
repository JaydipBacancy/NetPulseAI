import { z } from "zod";

// Accept canonical hex IDs used by Supabase UUID columns and deterministic seed data.
const databaseIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const databaseIdSchema = z
  .string()
  .trim()
  .regex(databaseIdPattern, "Invalid identifier.");

export function requiredDatabaseIdSchema(fieldLabel: string) {
  return z
    .string()
    .trim()
    .min(1, `Select a ${fieldLabel}.`)
    .regex(databaseIdPattern, `Invalid ${fieldLabel} selection.`);
}
