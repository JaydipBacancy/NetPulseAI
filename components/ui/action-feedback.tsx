import type { MutationActionState } from "@/lib/action-state";
import { cn } from "@/lib/utils";

type ActionFeedbackProps = {
  className?: string;
  state: MutationActionState;
};

export function ActionFeedback({ className, state }: ActionFeedbackProps) {
  const isError =
    state.status === "server_error" || state.status === "validation_error";

  if (!isError || !state.message) {
    return null;
  }

  return (
    <p
      className={cn("text-xs text-destructive", className)}
      role="alert"
    >
      {state.message}
    </p>
  );
}
