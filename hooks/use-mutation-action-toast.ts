"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { MutationActionState } from "@/lib/action-state";

export function useMutationActionToast(state: MutationActionState) {
  const lastHandledSubmission = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (state.status !== "success" || !state.submittedAt) {
      return;
    }

    if (lastHandledSubmission.current === state.submittedAt) {
      return;
    }

    lastHandledSubmission.current = state.submittedAt;
    toast.success(state.message);
  }, [state.message, state.status, state.submittedAt]);
}
