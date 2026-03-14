"use client";

import { useActionState, type ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import {
  initialPhaseCheckFormState,
  submitPhaseCheckAction,
} from "@/app/actions/phase-one";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePhaseCheckToast } from "@/hooks/use-phase-check-toast";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full sm:w-auto" disabled={pending} type="submit">
      {pending ? "Running server action..." : "Run readiness check"}
    </Button>
  );
}

type FormFieldProps = {
  id: "operatorName" | "contactEmail" | "targetNode";
  label: string;
  type?: ComponentProps<"input">["type"];
  placeholder: string;
  error?: string;
  value?: string;
};

function FormField({
  id,
  label,
  type = "text",
  placeholder,
  error,
  value,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input defaultValue={value ?? ""} id={id} name={id} placeholder={placeholder} type={type} />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

export function PhaseOneCheckForm() {
  const [state, formAction] = useActionState(
    submitPhaseCheckAction,
    initialPhaseCheckFormState,
  );
  const safeState = state ?? initialPhaseCheckFormState;
  const fieldErrors = safeState.fieldErrors ?? {};
  const values = safeState.values ?? {};

  usePhaseCheckToast({
    ...initialPhaseCheckFormState,
    ...safeState,
    fieldErrors,
    values,
  });

  return (
    <form action={formAction} className="grid gap-4">
      <FormField
        error={fieldErrors.operatorName?.[0]}
        id="operatorName"
        label="Operator or team"
        placeholder="NetOps West"
        value={values.operatorName}
      />
      <FormField
        error={fieldErrors.contactEmail?.[0]}
        id="contactEmail"
        label="Contact email"
        placeholder="noc@netpulse.ai"
        type="email"
        value={values.contactEmail}
      />
      <FormField
        error={fieldErrors.targetNode?.[0]}
        id="targetNode"
        label="Target node"
        placeholder="BLR-UPF-07"
        value={values.targetNode}
      />

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton />
        <p className="text-sm text-muted-foreground">
          Validates with Zod, executes on the server, and stores a readiness placeholder cookie.
        </p>
      </div>

      {safeState.status === "error" ? (
        <p className="text-sm text-destructive">{safeState.message}</p>
      ) : null}
    </form>
  );
}