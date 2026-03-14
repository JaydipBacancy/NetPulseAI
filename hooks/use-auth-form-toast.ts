"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

type AuthToastState = {
  message: string;
  status: "idle" | "validation_error" | "server_error" | "success";
  submittedAt?: string;
};

export function useAuthFormToast(state: AuthToastState) {
  const lastHandledEvent = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (
      !state.submittedAt ||
      state.status === "idle" ||
      state.status === "validation_error"
    ) {
      return;
    }

    if (lastHandledEvent.current === state.submittedAt) {
      return;
    }

    lastHandledEvent.current = state.submittedAt;

    if (state.status === "success") {
      toast.success(state.message);
      return;
    }

    toast.error(state.message);
  }, [state.message, state.status, state.submittedAt]);
}
