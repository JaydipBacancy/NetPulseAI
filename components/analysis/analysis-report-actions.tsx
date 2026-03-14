"use client";

import { useActionState } from "react";
import {
  deleteAnalysisReportAction,
  updateAnalysisReportRiskAction,
} from "@/app/actions/analysis-reports";
import { initialMutationActionState } from "@/lib/action-state";
import { ActionFeedback } from "@/components/ui/action-feedback";
import { Button } from "@/components/ui/button";
import { useMutationActionToast } from "@/hooks/use-mutation-action-toast";
import type { Database } from "@/types/supabase";

const inlineControlClassName =
  "h-9 rounded-xl border border-border/70 bg-card/92 px-2 py-1 text-xs text-foreground shadow-[0_10px_24px_-20px_rgba(15,23,42,0.16)] transition-colors [color-scheme:light] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60";

type AnalysisReportActionsProps = {
  reportId: string;
  riskLevel: Database["public"]["Enums"]["risk_level_enum"];
};

export function AnalysisReportActions({
  reportId,
  riskLevel,
}: AnalysisReportActionsProps) {
  const [updateState, updateFormAction, updatePending] = useActionState(
    updateAnalysisReportRiskAction,
    initialMutationActionState,
  );
  const [deleteState, deleteFormAction, deletePending] = useActionState(
    deleteAnalysisReportAction,
    initialMutationActionState,
  );

  useMutationActionToast(updateState);
  useMutationActionToast(deleteState);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <form action={updateFormAction} className="flex flex-wrap items-center gap-2">
          <input name="reportId" type="hidden" value={reportId} />
          <select
            className={inlineControlClassName}
            defaultValue={updateState.values?.riskLevel || riskLevel}
            disabled={updatePending}
            name="riskLevel"
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
            <option value="critical">critical</option>
          </select>
          <Button disabled={updatePending} size="sm" type="submit" variant="outline">
            {updatePending ? "Updating..." : "Update risk"}
          </Button>
        </form>
        <form action={deleteFormAction}>
          <input name="reportId" type="hidden" value={reportId} />
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
