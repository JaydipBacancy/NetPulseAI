import { z } from "zod";
import { requiredDatabaseIdSchema } from "@/lib/validations/database-id";

export const runPredefinedTestSchema = z.object({
  nodeId: requiredDatabaseIdSchema("node"),
  testCaseId: requiredDatabaseIdSchema("test case"),
});
