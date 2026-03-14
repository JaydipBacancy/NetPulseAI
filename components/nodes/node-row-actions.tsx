"use client";

import { useActionState } from "react";
import { deleteNodeAction, updateNodeAction } from "@/app/actions/nodes";
import { initialMutationActionState } from "@/lib/action-state";
import { ActionFeedback } from "@/components/ui/action-feedback";
import { Button } from "@/components/ui/button";
import { useMutationActionToast } from "@/hooks/use-mutation-action-toast";
import type { NodeStatus } from "@/types/nodes";

const inlineControlClassName =
  "h-9 rounded-xl border border-border/70 bg-card/92 px-2 py-1 text-xs text-foreground shadow-[0_10px_24px_-20px_rgba(15,23,42,0.16)] transition-colors [color-scheme:light] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60";

type NodeRowActionsProps = {
  availabilityPct: number;
  nodeId: string;
  status: NodeStatus;
};

export function NodeRowActions({
  availabilityPct,
  nodeId,
  status,
}: NodeRowActionsProps) {
  const [updateState, updateFormAction, updatePending] = useActionState(
    updateNodeAction,
    initialMutationActionState,
  );
  const [deleteState, deleteFormAction, deletePending] = useActionState(
    deleteNodeAction,
    initialMutationActionState,
  );

  useMutationActionToast(updateState);
  useMutationActionToast(deleteState);

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-end gap-2 whitespace-nowrap">
        <form action={updateFormAction} className="flex items-center gap-2">
          <input name="nodeId" type="hidden" value={nodeId} />
          <select
            className={`${inlineControlClassName} w-[7.5rem]`}
            defaultValue={updateState.values?.status || status}
            disabled={updatePending}
            name="status"
          >
            <option value="online">online</option>
            <option value="degraded">degraded</option>
            <option value="offline">offline</option>
            <option value="maintenance">maintenance</option>
          </select>
          <input
            className={`${inlineControlClassName} w-[6rem]`}
            defaultValue={updateState.values?.availabilityPct ?? String(availabilityPct)}
            disabled={updatePending}
            name="availabilityPct"
            step="0.01"
            type="number"
          />
          <Button
            className="min-w-[5.5rem]"
            disabled={updatePending}
            size="sm"
            type="submit"
            variant="outline"
          >
            {updatePending ? "Updating..." : "Update"}
          </Button>
        </form>
        <form action={deleteFormAction}>
          <input name="nodeId" type="hidden" value={nodeId} />
          <Button
            className="min-w-[5.5rem]"
            disabled={deletePending}
            size="sm"
            type="submit"
            variant="outline"
          >
            {deletePending ? "Deleting..." : "Delete"}
          </Button>
        </form>
      </div>
      <ActionFeedback state={updateState} />
      <ActionFeedback state={deleteState} />
    </div>
  );
}
