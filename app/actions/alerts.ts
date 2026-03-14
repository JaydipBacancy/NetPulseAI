"use server";

import { revalidatePath } from "next/cache";
import type { MutationActionState } from "@/lib/action-state";
import { getFormValues } from "@/lib/form-values";
import { createMetricSampleForAlert } from "@/lib/data/metric-samples";
import {
  assertOperationsAccess,
  getAccessControlMessage,
} from "@/lib/supabase/rbac";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createAlertSchema,
  deleteAlertSchema,
  updateAlertStatusSchema,
} from "@/lib/validations/alerts";
import type { CreateAlertFormState } from "@/types/alerts";

const createAlertFields = [
  "currentValue",
  "metricType",
  "nodeId",
  "severity",
  "summary",
  "thresholdValue",
  "title",
] as const;

function createActionTimestamp() {
  return new Date().toISOString();
}

function revalidateOperationalRoutes() {
  revalidatePath("/alerts");
  revalidatePath("/analysis");
  revalidatePath("/dashboard");
  revalidatePath("/nodes");
  revalidatePath("/reports");
}

export async function createAlertAction(
  _previousState: CreateAlertFormState,
  formData: FormData,
): Promise<CreateAlertFormState> {
  const values = getFormValues(formData, createAlertFields);
  const result = createAlertSchema.safeParse(values);

  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors,
      message: "Review the highlighted fields.",
      status: "validation_error",
      values,
    };
  }

  const actionTimestamp = createActionTimestamp();

  try {
    await assertOperationsAccess();
    const supabase = await createSupabaseServerClient();
    const nodeResponse = await supabase
      .from("network_nodes")
      .select("id,network_slice")
      .eq("id", result.data.nodeId)
      .single();

    if (nodeResponse.error || !nodeResponse.data) {
      return {
        fieldErrors: {},
        message: "Unable to validate node context for this alert.",
        status: "server_error",
        submittedAt: actionTimestamp,
        values,
      };
    }

    const metricSample = await createMetricSampleForAlert(supabase, {
      metricType: result.data.metricType,
      metricValue: result.data.currentValue,
      nodeId: result.data.nodeId,
      recordedAt: actionTimestamp,
      thresholdValue: result.data.thresholdValue,
    });

    if (!metricSample.ok) {
      return {
        fieldErrors: {},
        message: metricSample.errorMessage,
        status: "server_error",
        submittedAt: actionTimestamp,
        values,
      };
    }

    const { error: insertError } = await supabase.from("network_alerts").insert({
      current_value: result.data.currentValue,
      metric_id: metricSample.metricId,
      metric_type: result.data.metricType,
      network_slice: nodeResponse.data.network_slice,
      node_id: result.data.nodeId,
      severity: result.data.severity,
      status: "open",
      summary: result.data.summary,
      threshold_value: result.data.thresholdValue,
      title: result.data.title,
      triggered_at: actionTimestamp,
    });

    if (insertError) {
      return {
        fieldErrors: {},
        message: "Unable to create alert. Please try again.",
        status: "server_error",
        submittedAt: actionTimestamp,
        values,
      };
    }

    revalidateOperationalRoutes();

    return {
      fieldErrors: {},
      message: "Alert created successfully.",
      status: "success",
      submittedAt: actionTimestamp,
      values: {},
    };
  } catch (error) {
    return {
      fieldErrors: {},
      message: getAccessControlMessage(
        error,
        "Something went wrong while creating the alert.",
      ),
      status: "server_error",
      submittedAt: actionTimestamp,
      values,
    };
  }
}

export async function updateAlertStatusAction(
  _previousState: MutationActionState,
  formData: FormData,
): Promise<MutationActionState> {
  const actionTimestamp = createActionTimestamp();
  const result = updateAlertStatusSchema.safeParse({
    alertId: formData.get("alertId"),
    status: formData.get("status"),
  });

  if (!result.success) {
    return {
      message: "Unable to validate the requested alert update.",
      status: "validation_error",
      submittedAt: actionTimestamp,
    } satisfies MutationActionState;
  }

  try {
    await assertOperationsAccess();
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("network_alerts")
      .update({
        resolved_at: result.data.status === "resolved" ? actionTimestamp : null,
        status: result.data.status,
      })
      .eq("id", result.data.alertId);

    if (error) {
      return {
        message: "Unable to update alert status right now.",
        status: "server_error",
        submittedAt: actionTimestamp,
      } satisfies MutationActionState;
    }

    revalidateOperationalRoutes();

    return {
      message:
        result.data.status === "resolved"
          ? "Alert resolved successfully."
          : "Alert reopened successfully.",
      status: "success",
      submittedAt: actionTimestamp,
    } satisfies MutationActionState;
  } catch (error) {
    return {
      message: getAccessControlMessage(
        error,
        "Something went wrong while updating the alert.",
      ),
      status: "server_error",
      submittedAt: actionTimestamp,
    } satisfies MutationActionState;
  }
}

export async function deleteAlertAction(
  _previousState: MutationActionState,
  formData: FormData,
): Promise<MutationActionState> {
  const actionTimestamp = createActionTimestamp();
  const result = deleteAlertSchema.safeParse({
    alertId: formData.get("alertId"),
  });

  if (!result.success) {
    return {
      message: "Unable to identify the alert to delete.",
      status: "validation_error",
      submittedAt: actionTimestamp,
    } satisfies MutationActionState;
  }

  try {
    await assertOperationsAccess();
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("network_alerts")
      .delete()
      .eq("id", result.data.alertId);

    if (error) {
      return {
        message: "Unable to delete alert right now.",
        status: "server_error",
        submittedAt: actionTimestamp,
      } satisfies MutationActionState;
    }

    revalidateOperationalRoutes();

    return {
      message: "Alert deleted successfully.",
      status: "success",
      submittedAt: actionTimestamp,
    } satisfies MutationActionState;
  } catch (error) {
    return {
      message: getAccessControlMessage(
        error,
        "Something went wrong while deleting the alert.",
      ),
      status: "server_error",
      submittedAt: actionTimestamp,
    } satisfies MutationActionState;
  }
}
