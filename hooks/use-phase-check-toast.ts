"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { PhaseCheckFormState } from "@/types/phase-one";

export function usePhaseCheckToast(state: PhaseCheckFormState) {
  const lastHandledSubmission = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (state.status !== "success" || !state.lastSubmittedAt) {
      return;
    }

    if (lastHandledSubmission.current === state.lastSubmittedAt) {
      return;
    }

    lastHandledSubmission.current = state.lastSubmittedAt;
    toast.success(state.message);
  }, [state.lastSubmittedAt, state.message, state.status]);
}
