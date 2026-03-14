export type MutationActionState = {
  message: string;
  status: "idle" | "server_error" | "success" | "validation_error";
  submittedAt?: string;
  values?: Record<string, string>;
};

export const initialMutationActionState: MutationActionState = {
  message: "",
  status: "idle",
  values: {},
};