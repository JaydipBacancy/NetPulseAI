"use server";

import { revalidatePath } from "next/cache";
import type { MutationActionState } from "@/lib/action-state";
import { getFormValues } from "@/lib/form-values";
import {
  assertAdminAccess,
  getAccessControlMessage,
} from "@/lib/supabase/rbac";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  updateUserRoleSchema,
  updateUserStatusSchema,
} from "@/lib/validations/user-management";

const updateUserRoleFields = ["role", "userId"] as const;
const updateUserStatusFields = ["nextIsActive", "userId"] as const;

function createActionTimestamp() {
  return new Date().toISOString();
}

function revalidateWorkspaceRoutes() {
  revalidatePath("/dashboard");
  revalidatePath("/nodes");
  revalidatePath("/alerts");
  revalidatePath("/tests");
  revalidatePath("/analysis");
  revalidatePath("/reports");
}

export async function updateUserRoleAction(
  _previousState: MutationActionState,
  formData: FormData,
): Promise<MutationActionState> {
  const actionTimestamp = createActionTimestamp();
  const values = getFormValues(formData, updateUserRoleFields);
  const result = updateUserRoleSchema.safeParse(values);

  if (!result.success) {
    return {
      message: "Review the submitted access role.",
      status: "validation_error",
      submittedAt: actionTimestamp,
      values,
    } satisfies MutationActionState;
  }

  try {
    const access = await assertAdminAccess();

    if (result.data.userId === access.profile.id) {
      return {
        message: "Admins cannot change their own role from the dashboard.",
        status: "validation_error",
        submittedAt: actionTimestamp,
        values,
      } satisfies MutationActionState;
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        role: result.data.role,
      })
      .eq("id", result.data.userId)
      .select("id")
      .maybeSingle();

    if (error || !data) {
      return {
        message: "Unable to update the selected user role right now.",
        status: "server_error",
        submittedAt: actionTimestamp,
        values,
      } satisfies MutationActionState;
    }

    revalidateWorkspaceRoutes();

    return {
      message: `User role updated to ${result.data.role}.`,
      status: "success",
      submittedAt: actionTimestamp,
      values: {},
    } satisfies MutationActionState;
  } catch (error) {
    return {
      message: getAccessControlMessage(
        error,
        "Something went wrong while updating the user role.",
      ),
      status: "server_error",
      submittedAt: actionTimestamp,
      values,
    } satisfies MutationActionState;
  }
}

export async function updateUserStatusAction(
  _previousState: MutationActionState,
  formData: FormData,
): Promise<MutationActionState> {
  const actionTimestamp = createActionTimestamp();
  const values = getFormValues(formData, updateUserStatusFields);
  const result = updateUserStatusSchema.safeParse(values);

  if (!result.success) {
    return {
      message: "Review the submitted access status.",
      status: "validation_error",
      submittedAt: actionTimestamp,
      values,
    } satisfies MutationActionState;
  }

  try {
    const access = await assertAdminAccess();

    if (result.data.userId === access.profile.id) {
      return {
        message: "Admins cannot deactivate or reactivate themselves from the dashboard.",
        status: "validation_error",
        submittedAt: actionTimestamp,
        values,
      } satisfies MutationActionState;
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        is_active: result.data.nextIsActive === "true",
      })
      .eq("id", result.data.userId)
      .select("id")
      .maybeSingle();

    if (error || !data) {
      return {
        message: "Unable to update the selected user status right now.",
        status: "server_error",
        submittedAt: actionTimestamp,
        values,
      } satisfies MutationActionState;
    }

    revalidateWorkspaceRoutes();

    return {
      message:
        result.data.nextIsActive === "true"
          ? "User access restored."
          : "User access disabled.",
      status: "success",
      submittedAt: actionTimestamp,
      values: {},
    } satisfies MutationActionState;
  } catch (error) {
    return {
      message: getAccessControlMessage(
        error,
        "Something went wrong while updating the user status.",
      ),
      status: "server_error",
      submittedAt: actionTimestamp,
      values,
    } satisfies MutationActionState;
  }
}
