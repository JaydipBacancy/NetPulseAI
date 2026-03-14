"use client";

import { useActionState } from "react";
import {
  updateUserRoleAction,
  updateUserStatusAction,
} from "@/app/actions/user-management";
import { ActionFeedback } from "@/components/ui/action-feedback";
import { Button } from "@/components/ui/button";
import { initialMutationActionState } from "@/lib/action-state";
import { useMutationActionToast } from "@/hooks/use-mutation-action-toast";
import type { WorkspaceProfile } from "@/types/access";

const inlineControlClassName =
  "h-9 min-w-[7.5rem] rounded-xl border border-border/70 bg-card/92 px-2 py-1 text-xs text-foreground shadow-[0_10px_24px_-20px_rgba(15,23,42,0.16)] transition-colors [color-scheme:light] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60";

type UserAccessRowActionsProps = {
  canEdit: boolean;
  user: WorkspaceProfile;
};

export function UserAccessRowActions({
  canEdit,
  user,
}: UserAccessRowActionsProps) {
  const [roleState, roleFormAction, rolePending] = useActionState(
    updateUserRoleAction,
    initialMutationActionState,
  );
  const [statusState, statusFormAction, statusPending] = useActionState(
    updateUserStatusAction,
    initialMutationActionState,
  );

  useMutationActionToast(roleState);
  useMutationActionToast(statusState);

  if (!canEdit) {
    return (
      <p className="text-xs text-muted-foreground">
        Current session. Self role and status changes are blocked here.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <form action={roleFormAction} className="flex flex-wrap items-center gap-2">
          <input name="userId" type="hidden" value={user.id} />
          <select
            className={inlineControlClassName}
            defaultValue={roleState.values?.role || user.role}
            disabled={rolePending}
            name="role"
          >
            <option value="admin">admin</option>
            <option value="operator">operator</option>
            <option value="viewer">viewer</option>
          </select>
          <Button disabled={rolePending} size="sm" type="submit" variant="outline">
            {rolePending ? "Updating..." : "Update role"}
          </Button>
        </form>

        <form action={statusFormAction}>
          <input name="userId" type="hidden" value={user.id} />
          <input
            name="nextIsActive"
            type="hidden"
            value={user.isActive ? "false" : "true"}
          />
          <Button disabled={statusPending} size="sm" type="submit" variant="outline">
            {statusPending
              ? user.isActive
                ? "Disabling..."
                : "Restoring..."
              : user.isActive
                ? "Disable access"
                : "Restore access"}
          </Button>
        </form>
      </div>
      <ActionFeedback state={roleState} />
      <ActionFeedback state={statusState} />
    </div>
  );
}
