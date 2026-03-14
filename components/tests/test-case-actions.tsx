"use client";

import { useActionState } from "react";
import {
  deleteTestCaseAction,
  updateTestCaseAction,
} from "@/app/actions/test-cases";
import { initialMutationActionState } from "@/lib/action-state";
import { ActionFeedback } from "@/components/ui/action-feedback";
import { Button } from "@/components/ui/button";
import { useMutationActionToast } from "@/hooks/use-mutation-action-toast";
import type { Database } from "@/types/supabase";

const inlineControlClassName =
  "h-9 min-w-[7rem] rounded-xl border border-input bg-background/90 px-2 py-1 text-xs text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60";

type TestCaseActionsProps = {
  isActive: boolean;
  passCondition: Database["public"]["Enums"]["test_operator_enum"];
  passThreshold: number;
  testCaseId: string;
};

export function TestCaseActions({
  isActive,
  passCondition,
  passThreshold,
  testCaseId,
}: TestCaseActionsProps) {
  const [updateState, updateFormAction, updatePending] = useActionState(
    updateTestCaseAction,
    initialMutationActionState,
  );
  const [deleteState, deleteFormAction, deletePending] = useActionState(
    deleteTestCaseAction,
    initialMutationActionState,
  );

  useMutationActionToast(updateState);
  useMutationActionToast(deleteState);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <form action={updateFormAction} className="flex flex-wrap items-center gap-2">
          <input name="testCaseId" type="hidden" value={testCaseId} />
          <select
            className={inlineControlClassName}
            defaultValue={updateState.values?.passCondition || passCondition}
            disabled={updatePending}
            name="passCondition"
          >
            <option value="lte">lte</option>
            <option value="gte">gte</option>
          </select>
          <input
            className={inlineControlClassName}
            defaultValue={updateState.values?.passThreshold ?? String(passThreshold)}
            disabled={updatePending}
            name="passThreshold"
            step="0.01"
            type="number"
          />
          <label className="flex items-center gap-1 text-xs text-muted-foreground">
            <input
              defaultChecked={
                updateState.values?.isActive !== undefined
                  ? updateState.values.isActive === "on"
                  : isActive
              }
              disabled={updatePending}
              name="isActive"
              type="checkbox"
            />
            active
          </label>
          <Button disabled={updatePending} size="sm" type="submit" variant="outline">
            {updatePending ? "Updating..." : "Update"}
          </Button>
        </form>
        <form action={deleteFormAction}>
          <input name="testCaseId" type="hidden" value={testCaseId} />
          <Button disabled={deletePending} size="sm" type="submit" variant="outline">
            {deletePending ? "Deleting..." : "Delete"}
          </Button>
        </form>
      </div>
      <ActionFeedback state={updateState} />
      <ActionFeedback state={deleteState} />
    </div>
  );
}