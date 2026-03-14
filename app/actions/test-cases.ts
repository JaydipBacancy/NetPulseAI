"use server";

import { revalidatePath } from "next/cache";
import type { MutationActionState } from "@/lib/action-state";
import { getFormValues } from "@/lib/form-values";
import {
  assertOperationsAccess,
  getAccessControlMessage,
} from "@/lib/supabase/rbac";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createTestCaseSchema,
  deleteTestCaseSchema,
  updateTestCaseSchema,
} from "@/lib/validations/test-cases";
import type { CreateTestCaseFormState } from "@/types/tests";

const createTestCaseFields = [
  "category",
  "description",
  "estimatedDurationSeconds",
  "name",
  "passCondition",
  "passThreshold",
  "slug",
  "targetMetric",
] as const;
const updateTestCaseFields = [
  "isActive",
  "passCondition",
  "passThreshold",
  "testCaseId",
] as const;

function createActionTimestamp() {
  return new Date().toISOString();
}

function revalidateOperationalRoutes() {
  revalidatePath("/tests");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
}

export async function createTestCaseAction(
  _previousState: CreateTestCaseFormState,
  formData: FormData,
): Promise<CreateTestCaseFormState> {
  const values = getFormValues(formData, createTestCaseFields);
  const result = createTestCaseSchema.safeParse(values);

  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors,
      message: "Review the highlighted fields.",
      status: "validation_error",
      values,
    };
  }

  try {
    await assertOperationsAccess();
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("test_cases").insert({
      category: result.data.category,
      description: result.data.description,
      estimated_duration_seconds: result.data.estimatedDurationSeconds,
      name: result.data.name,
      pass_condition: result.data.passCondition,
      pass_threshold: result.data.passThreshold,
      slug: result.data.slug,
      target_metric: result.data.targetMetric,
    });

    if (error) {
      return {
        fieldErrors: {},
        message: "Unable to create test case. Ensure slug is unique.",
        status: "server_error",
        submittedAt: createActionTimestamp(),
        values,
      };
    }

    revalidateOperationalRoutes();

    return {
      fieldErrors: {},
      message: `${result.data.name} created successfully.`,
      status: "success",
      submittedAt: createActionTimestamp(),
      values: {},
    };
  } catch (error) {
    return {
      fieldErrors: {},
      message: getAccessControlMessage(
        error,
        "Something went wrong while creating the test case.",
      ),
      status: "server_error",
      submittedAt: createActionTimestamp(),
      values,
    };
  }
}

export async function updateTestCaseAction(
  _previousState: MutationActionState,
  formData: FormData,
): Promise<MutationActionState> {
  const actionTimestamp = createActionTimestamp();
  const values = getFormValues(formData, updateTestCaseFields);
  const result = updateTestCaseSchema.safeParse(values);

  if (!result.success) {
    return {
      message: "Review the submitted test case values.",
      status: "validation_error",
      submittedAt: actionTimestamp,
      values,
    } satisfies MutationActionState;
  }

  try {
    await assertOperationsAccess();
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("test_cases")
      .update({
        is_active: result.data.isActive,
        pass_condition: result.data.passCondition,
        pass_threshold: result.data.passThreshold,
      })
      .eq("id", result.data.testCaseId);

    if (error) {
      return {
        message: "Unable to update test case right now.",
        status: "server_error",
        submittedAt: actionTimestamp,
        values,
      } satisfies MutationActionState;
    }

    revalidateOperationalRoutes();

    return {
      message: "Test case updated successfully.",
      status: "success",
      submittedAt: actionTimestamp,
      values: {},
    } satisfies MutationActionState;
  } catch (error) {
    return {
      message: getAccessControlMessage(
        error,
        "Something went wrong while updating the test case.",
      ),
      status: "server_error",
      submittedAt: actionTimestamp,
      values,
    } satisfies MutationActionState;
  }
}

export async function deleteTestCaseAction(
  _previousState: MutationActionState,
  formData: FormData,
): Promise<MutationActionState> {
  const actionTimestamp = createActionTimestamp();
  const result = deleteTestCaseSchema.safeParse({
    testCaseId: formData.get("testCaseId"),
  });

  if (!result.success) {
    return {
      message: "Unable to identify the test case to delete.",
      status: "validation_error",
      submittedAt: actionTimestamp,
    } satisfies MutationActionState;
  }

  try {
    await assertOperationsAccess();
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("test_cases")
      .delete()
      .eq("id", result.data.testCaseId);

    if (error) {
      return {
        message: "Unable to delete test case right now.",
        status: "server_error",
        submittedAt: actionTimestamp,
      } satisfies MutationActionState;
    }

    revalidateOperationalRoutes();

    return {
      message: "Test case deleted successfully.",
      status: "success",
      submittedAt: actionTimestamp,
    } satisfies MutationActionState;
  } catch (error) {
    return {
      message: getAccessControlMessage(
        error,
        "Something went wrong while deleting the test case.",
      ),
      status: "server_error",
      submittedAt: actionTimestamp,
    } satisfies MutationActionState;
  }
}
