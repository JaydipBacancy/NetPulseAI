"use server";

import { revalidatePath } from "next/cache";
import type { MutationActionState } from "@/lib/action-state";
import { getFormValues } from "@/lib/form-values";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  deleteAnalysisReportSchema,
  updateAnalysisReportRiskSchema,
} from "@/lib/validations/analysis";

const updateAnalysisReportFields = ["reportId", "riskLevel"] as const;

function createActionTimestamp() {
  return new Date().toISOString();
}

function revalidateOperationalRoutes() {
  revalidatePath("/analysis");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
}

export async function updateAnalysisReportRiskAction(
  _previousState: MutationActionState,
  formData: FormData,
): Promise<MutationActionState> {
  const actionTimestamp = createActionTimestamp();
  const values = getFormValues(formData, updateAnalysisReportFields);
  const result = updateAnalysisReportRiskSchema.safeParse(values);

  if (!result.success) {
    return {
      message: "Review the submitted risk value.",
      status: "validation_error",
      submittedAt: actionTimestamp,
      values,
    } satisfies MutationActionState;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("analysis_reports")
      .update({
        risk_level: result.data.riskLevel,
      })
      .eq("id", result.data.reportId);

    if (error) {
      return {
        message: "Unable to update risk level right now.",
        status: "server_error",
        submittedAt: actionTimestamp,
        values,
      } satisfies MutationActionState;
    }

    revalidateOperationalRoutes();

    return {
      message: "Risk level updated successfully.",
      status: "success",
      submittedAt: actionTimestamp,
      values: {},
    } satisfies MutationActionState;
  } catch {
    return {
      message: "Something went wrong while updating the report.",
      status: "server_error",
      submittedAt: actionTimestamp,
      values,
    } satisfies MutationActionState;
  }
}

export async function deleteAnalysisReportAction(
  _previousState: MutationActionState,
  formData: FormData,
): Promise<MutationActionState> {
  const actionTimestamp = createActionTimestamp();
  const result = deleteAnalysisReportSchema.safeParse({
    reportId: formData.get("reportId"),
  });

  if (!result.success) {
    return {
      message: "Unable to identify the report to delete.",
      status: "validation_error",
      submittedAt: actionTimestamp,
    } satisfies MutationActionState;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("analysis_reports")
      .delete()
      .eq("id", result.data.reportId);

    if (error) {
      return {
        message: "Unable to delete report right now.",
        status: "server_error",
        submittedAt: actionTimestamp,
      } satisfies MutationActionState;
    }

    revalidateOperationalRoutes();

    return {
      message: "Report deleted successfully.",
      status: "success",
      submittedAt: actionTimestamp,
    } satisfies MutationActionState;
  } catch {
    return {
      message: "Something went wrong while deleting the report.",
      status: "server_error",
      submittedAt: actionTimestamp,
    } satisfies MutationActionState;
  }
}