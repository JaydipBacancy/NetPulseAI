"use server";

import { revalidatePath } from "next/cache";
import { getFormValues } from "@/lib/form-values";
import { executePredefinedTest } from "@/lib/data/tests-runner";
import { runPredefinedTestSchema } from "@/lib/validations/tests";
import type { RunTestFormState } from "@/types/tests";

const runTestFields = ["nodeId", "testCaseId"] as const;

function createActionTimestamp() {
  return new Date().toISOString();
}

export async function runPredefinedTestAction(
  _previousState: RunTestFormState,
  formData: FormData,
): Promise<RunTestFormState> {
  const values = getFormValues(formData, runTestFields);
  const result = runPredefinedTestSchema.safeParse(values);

  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors,
      message: "Select a node and test case to continue.",
      status: "validation_error",
      values,
    };
  }

  const executedAt = createActionTimestamp();
  const executionResult = await executePredefinedTest({
    executedAt,
    nodeId: result.data.nodeId,
    testCaseId: result.data.testCaseId,
  });

  if (!executionResult.ok) {
    return {
      fieldErrors: {},
      message: executionResult.value.errorMessage,
      status: "server_error",
      submittedAt: executedAt,
      values,
    };
  }

  revalidatePath("/tests");

  return {
    fieldErrors: {},
    message: `${executionResult.value.testName} ${executionResult.value.status.toUpperCase()} on ${executionResult.value.nodeName}.`,
    status: "success",
    submittedAt: executedAt,
    values: {},
  };
}