"use server";

import { revalidatePath } from "next/cache";
import { getFormValues } from "@/lib/form-values";
import { executePredefinedTest } from "@/lib/data/tests-runner";
import {
  assertOperationsAccess,
  getAccessControlMessage,
} from "@/lib/supabase/rbac";
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
      resultStatus: undefined,
      status: "validation_error",
      values,
    };
  }

  const executedAt = createActionTimestamp();

  try {
    await assertOperationsAccess();
  } catch (error) {
    return {
      fieldErrors: {},
      message: getAccessControlMessage(
        error,
        "Something went wrong while running the test.",
      ),
      resultStatus: undefined,
      status: "server_error",
      submittedAt: executedAt,
      values,
    };
  }

  const executionResult = await executePredefinedTest({
    executedAt,
    nodeId: result.data.nodeId,
    testCaseId: result.data.testCaseId,
  });

  if (!executionResult.ok) {
    return {
      fieldErrors: {},
      message: executionResult.value.errorMessage,
      resultStatus: undefined,
      status: "server_error",
      submittedAt: executedAt,
      values,
    };
  }

  revalidatePath("/tests");

  return {
    fieldErrors: {},
    message: `${executionResult.value.testName} ${executionResult.value.status.toUpperCase()} on ${executionResult.value.nodeName}.`,
    resultStatus: executionResult.value.status,
    status: "success",
    submittedAt: executedAt,
    values: {},
  };
}
