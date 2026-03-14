"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getFormValues } from "@/lib/form-values";
import { getWorkspaceAccessForClient } from "@/lib/supabase/rbac";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  signInSchema,
  signUpSchema,
} from "@/lib/validations/auth";
import type {
  SignInFormState,
  SignUpFormState,
} from "@/types/auth";

const signInFields = ["email", "password"] as const;
const signUpFields = [
  "confirmPassword",
  "email",
  "fullName",
  "password",
] as const;
type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

function createActionTimestamp() {
  return new Date().toISOString();
}

async function ensureWorkspaceAccess(
  supabase: SupabaseServerClient,
) {
  const access = await getWorkspaceAccessForClient(supabase);

  if (!access.profile) {
    await supabase.auth.signOut();
    return "Your workspace access is not configured yet. Contact an administrator.";
  }

  if (!access.profile.isActive) {
    await supabase.auth.signOut();
    return "Your workspace access is disabled. Contact an administrator.";
  }

  return null;
}

export async function submitSignInAction(
  _previousState: SignInFormState,
  formData: FormData,
): Promise<SignInFormState> {
  const values = getFormValues(formData, signInFields);
  const result = signInSchema.safeParse(values);

  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors,
      message: "Review the highlighted fields and try again.",
      status: "validation_error",
      values,
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword(result.data);

    if (error) {
      return {
        fieldErrors: {},
        message: "Unable to sign in. Check your credentials and try again.",
        status: "server_error",
        submittedAt: createActionTimestamp(),
        values,
      };
    }

    const accessError = await ensureWorkspaceAccess(supabase);

    if (accessError) {
      return {
        fieldErrors: {},
        message: accessError,
        status: "server_error",
        submittedAt: createActionTimestamp(),
        values,
      };
    }
  } catch {
    return {
      fieldErrors: {},
      message: "Something went wrong while signing in.",
      status: "server_error",
      submittedAt: createActionTimestamp(),
      values,
    };
  }

  redirect("/dashboard");
}

export async function submitSignUpAction(
  _previousState: SignUpFormState,
  formData: FormData,
): Promise<SignUpFormState> {
  const values = getFormValues(formData, signUpFields);
  const result = signUpSchema.safeParse(values);

  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors,
      message: "Review the highlighted fields and try again.",
      status: "validation_error",
      values,
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const headerStore = await headers();
    const origin = headerStore.get("origin") ?? "http://localhost:3000";
    const credentials = {
      email: result.data.email,
      password: result.data.password,
    };

    const { data, error } = await supabase.auth.signUp({
      ...credentials,
      options: {
        data: {
          full_name: result.data.fullName,
        },
        emailRedirectTo: `${origin}/auth/confirm?next=/dashboard`,
      },
    });

    if (error) {
      return {
        fieldErrors: {},
        message:
          "Unable to create your account. Try a different email or review your Supabase auth settings.",
        status: "server_error",
        submittedAt: createActionTimestamp(),
        values,
      };
    }

    if (data.session) {
      const accessError = await ensureWorkspaceAccess(supabase);

      if (accessError) {
        return {
          fieldErrors: {},
          message: accessError,
          status: "server_error",
          submittedAt: createActionTimestamp(),
          values,
        };
      }

      redirect("/dashboard");
    }
  } catch {
    return {
      fieldErrors: {},
      message: "Something went wrong while creating your account.",
      status: "server_error",
      submittedAt: createActionTimestamp(),
      values,
    };
  }

  return {
    fieldErrors: {},
    message:
      "Account created. If email confirmation is enabled in Supabase, confirm your email and then sign in. Admins can adjust operational access after signup.",
    status: "success",
    submittedAt: createActionTimestamp(),
    values: {},
  };
}

export async function signOutAction(formData?: FormData) {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  const redirectToValue = formData?.get("redirectTo");
  const redirectTo =
    typeof redirectToValue === "string" && redirectToValue.startsWith("/")
      ? redirectToValue
      : "/signin";
  redirect(redirectTo);
}
