export type PhaseCheckFieldName = "operatorName" | "contactEmail" | "targetNode";

export type PhaseCheckFieldErrors = Partial<
  Record<PhaseCheckFieldName, string[]>
>;

export type PhaseCheckFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors: PhaseCheckFieldErrors;
  lastSubmittedAt?: string;
  values: Partial<Record<PhaseCheckFieldName, string>>;
};