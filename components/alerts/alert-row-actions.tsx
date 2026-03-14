"use client";

import { useActionState } from "react";
import {
  deleteAlertAction,
  updateAlertStatusAction,
} from "@/app/actions/alerts";
import { initialMutationActionState } from "@/lib/action-state";
import { ActionFeedback } from "@/components/ui/action-feedback";
import { Button } from "@/components/ui/button";
import { useMutationActionToast } from "@/hooks/use-mutation-action-toast";
import type { AlertStatus } from "@/types/alerts";

type AlertRowActionsProps = {
  alertId: string;
  status: AlertStatus;
};

export function AlertRowActions({ alertId, status }: AlertRowActionsProps) {
  const [updateState, updateFormAction, updatePending] = useActionState(
    updateAlertStatusAction,
    initialMutationActionState,
  );
  const [deleteState, deleteFormAction, deletePending] = useActionState(
    deleteAlertAction,
    initialMutationActionState,
  );

  useMutationActionToast(updateState);
  useMutationActionToast(deleteState);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <form action={updateFormAction}>
          <input name="alertId" type="hidden" value={alertId} />
          <input
            name="status"
            type="hidden"
            value={status === "open" ? "resolved" : "open"}
          />
          <Button disabled={updatePending} size="sm" type="submit" variant="outline">
            {updatePending
              ? status === "open"
                ? "Resolving..."
                : "Reopening..."
              : status === "open"
                ? "Resolve"
                : "Reopen"}
          </Button>
        </form>
        <form action={deleteFormAction}>
          <input name="alertId" type="hidden" value={alertId} />
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
