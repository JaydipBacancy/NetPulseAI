import { z } from "zod";
import { databaseIdSchema } from "@/lib/validations/database-id";

const riskLevelSchema = z.enum(["low", "medium", "high", "critical"]);

export const updateAnalysisReportRiskSchema = z.object({
  reportId: databaseIdSchema,
  riskLevel: riskLevelSchema,
});

export const deleteAnalysisReportSchema = z.object({
  reportId: databaseIdSchema,
});
