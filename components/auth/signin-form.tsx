"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitSignInAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthFormToast } from "@/hooks/use-auth-form-toast";
import { initialSignInFormState } from "@/lib/data/auth-form-state";

export function SignInForm() {
  const [state, formAction, pending] = useActionState(
    submitSignInAction,
    initialSignInFormState,
  );

  useAuthFormToast(state);

  return (
    <form action={formAction} className="grid gap-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="signin-email">Email</Label>
        <Input
          autoComplete="email"
          defaultValue={state.values.email ?? ""}
          id="signin-email"
          name="email"
          placeholder="noc@netpulse.ai"
          type="email"
        />
        {state.fieldErrors.email?.[0] ? (
          <p className="text-sm text-destructive">{state.fieldErrors.email[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="signin-password">Password</Label>
          <Link className="text-xs font-medium text-primary" href="/signup">
            Need an account?
          </Link>
        </div>
        <Input
          autoComplete="current-password"
          defaultValue={state.values.password ?? ""}
          id="signin-password"
          name="password"
          placeholder="Enter your password"
          type="password"
        />
        {state.fieldErrors.password?.[0] ? (
          <p className="text-sm text-destructive">
            {state.fieldErrors.password[0]}
          </p>
        ) : null}
      </div>

      {state.status === "server_error" ? (
        <p className="text-sm text-destructive">{state.message}</p>
      ) : null}

      <Button className="mt-2 w-full" disabled={pending} type="submit">
        {pending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}