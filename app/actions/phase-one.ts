"use server";

import { cookies } from "next/headers";
import { getFormValues } from "@/lib/form-values";
import { phaseCheckSchema } from "@/lib/validations/phase-check";
import type { PhaseCheckFormState } from "@/types/phase-one";

const PHASE_CHECK_COOKIE = "netpulse-phase1-check";
const phaseCheckFields = [
  "operatorName",
  "contactEmail",
  "targetNode",
] as const;

export const initialPhaseCheckFormState: PhaseCheckFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  values: {},
};

export async function submitPhaseCheckAction(
  _previousState: PhaseCheckFormState,
  formData: FormData,
): Promise<PhaseCheckFormState> {
  const values = getFormValues(formData, phaseCheckFields);
  const result = phaseCheckSchema.safeParse(values);

  if (!result.success) {
    return {
      status: "error",
      message: "Review the highlighted fields and submit again.",
      fieldErrors: result.error.flatten().fieldErrors,
      values,
    };
  }

  const submittedAt = new Date().toISOString();
  const cookieStore = await cookies();

  cookieStore.set(
    PHASE_CHECK_COOKIE,
    JSON.stringify({
      ...result.data,
      submittedAt,
    }),
    {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    },
  );

  return {
    status: "success",
    message: `Server action validated ${result.data.targetNode} and stored the readiness snapshot.`,
    fieldErrors: {},
    lastSubmittedAt: submittedAt,
    values: {},
  };
}