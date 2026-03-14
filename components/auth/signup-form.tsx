"use client";

import { useActionState } from "react";
import { submitSignUpAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthFormToast } from "@/hooks/use-auth-form-toast";
import { initialSignUpFormState } from "@/lib/data/auth-form-state";

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(
    submitSignUpAction,
    initialSignUpFormState,
  );

  useAuthFormToast(state);

  return (
    <form action={formAction} className="grid gap-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="signup-fullName">Full name</Label>
        <Input
          autoComplete="name"
          defaultValue={state.values.fullName ?? ""}
          id="signup-fullName"
          name="fullName"
          placeholder="Aarav Menon"
          type="text"
        />
        {state.fieldErrors.fullName?.[0] ? (
          <p className="text-sm text-destructive">
            {state.fieldErrors.fullName[0]}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          autoComplete="email"
          defaultValue={state.values.email ?? ""}
          id="signup-email"
          name="email"
          placeholder="ops@netpulse.ai"
          type="email"
        />
        {state.fieldErrors.email?.[0] ? (
          <p className="text-sm text-destructive">{state.fieldErrors.email[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          autoComplete="new-password"
          defaultValue={state.values.password ?? ""}
          id="signup-password"
          name="password"
          placeholder="Create a password"
          type="password"
        />
        {state.fieldErrors.password?.[0] ? (
          <p className="text-sm text-destructive">
            {state.fieldErrors.password[0]}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-confirmPassword">Confirm password</Label>
        <Input
          autoComplete="new-password"
          defaultValue={state.values.confirmPassword ?? ""}
          id="signup-confirmPassword"
          name="confirmPassword"
          placeholder="Confirm your password"
          type="password"
        />
        {state.fieldErrors.confirmPassword?.[0] ? (
          <p className="text-sm text-destructive">
            {state.fieldErrors.confirmPassword[0]}
          </p>
        ) : null}
      </div>

      {state.status === "server_error" ? (
        <p className="text-sm text-destructive">{state.message}</p>
      ) : null}
      {state.status === "success" ? (
        <p className="text-sm text-primary">{state.message}</p>
      ) : null}

      <Button className="mt-2 w-full" disabled={pending} type="submit">
        {pending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}