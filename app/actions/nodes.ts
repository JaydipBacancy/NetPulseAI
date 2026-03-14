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
  createNodeSchema,
  deleteNodeSchema,
  updateNodeSchema,
} from "@/lib/validations/nodes";
import type { CreateNodeFormState } from "@/types/nodes";

const createNodeFields = [
  "availabilityPct",
  "name",
  "networkSlice",
  "nodeType",
  "region",
  "siteCode",
  "softwareVersion",
  "status",
  "vendor",
] as const;
const updateNodeFields = ["availabilityPct", "nodeId", "status"] as const;

function createActionTimestamp() {
  return new Date().toISOString();
}

function revalidateOperationalRoutes() {
  revalidatePath("/nodes");
  revalidatePath("/dashboard");
  revalidatePath("/alerts");
  revalidatePath("/tests");
  revalidatePath("/analysis");
  revalidatePath("/reports");
}

export async function createNodeAction(
  _previousState: CreateNodeFormState,
  formData: FormData,
): Promise<CreateNodeFormState> {
  const values = getFormValues(formData, createNodeFields);
  const result = createNodeSchema.safeParse(values);

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
    const { error } = await supabase.from("network_nodes").insert({
      availability_pct: result.data.availabilityPct,
      name: result.data.name,
      network_slice: result.data.networkSlice,
      node_type: result.data.nodeType,
      region: result.data.region,
      site_code: result.data.siteCode,
      software_version: result.data.softwareVersion,
      status: result.data.status,
      vendor: result.data.vendor,
    });

    if (error) {
      return {
        fieldErrors: {},
        message: "Unable to create node. Ensure site code is unique.",
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
        "Something went wrong while creating the node.",
      ),
      status: "server_error",
      submittedAt: createActionTimestamp(),
      values,
    };
  }
}

export async function updateNodeAction(
  _previousState: MutationActionState,
  formData: FormData,
): Promise<MutationActionState> {
  const actionTimestamp = createActionTimestamp();
  const values = getFormValues(formData, updateNodeFields);
  const result = updateNodeSchema.safeParse(values);

  if (!result.success) {
    return {
      message: "Review the submitted node values.",
      status: "validation_error",
      submittedAt: actionTimestamp,
      values,
    } satisfies MutationActionState;
  }

  try {
    await assertOperationsAccess();
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("network_nodes")
      .update({
        availability_pct: result.data.availabilityPct,
        status: result.data.status,
      })
      .eq("id", result.data.nodeId);

    if (error) {
      return {
        message: "Unable to update node right now.",
        status: "server_error",
        submittedAt: actionTimestamp,
        values,
      } satisfies MutationActionState;
    }

    revalidateOperationalRoutes();

    return {
      message: "Node updated successfully.",
      status: "success",
      submittedAt: actionTimestamp,
      values: {},
    } satisfies MutationActionState;
  } catch (error) {
    return {
      message: getAccessControlMessage(
        error,
        "Something went wrong while updating the node.",
      ),
      status: "server_error",
      submittedAt: actionTimestamp,
      values,
    } satisfies MutationActionState;
  }
}

export async function deleteNodeAction(
  _previousState: MutationActionState,
  formData: FormData,
): Promise<MutationActionState> {
  const actionTimestamp = createActionTimestamp();
  const result = deleteNodeSchema.safeParse({
    nodeId: formData.get("nodeId"),
  });

  if (!result.success) {
    return {
      message: "Unable to identify the node to delete.",
      status: "validation_error",
      submittedAt: actionTimestamp,
    } satisfies MutationActionState;
  }

  try {
    await assertOperationsAccess();
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("network_nodes")
      .delete()
      .eq("id", result.data.nodeId);

    if (error) {
      return {
        message: "Unable to delete node right now.",
        status: "server_error",
        submittedAt: actionTimestamp,
      } satisfies MutationActionState;
    }

    revalidateOperationalRoutes();

    return {
      message: "Node deleted successfully.",
      status: "success",
      submittedAt: actionTimestamp,
    } satisfies MutationActionState;
  } catch (error) {
    return {
      message: getAccessControlMessage(
        error,
        "Something went wrong while deleting the node.",
      ),
      status: "server_error",
      submittedAt: actionTimestamp,
    } satisfies MutationActionState;
  }
}
