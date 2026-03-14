import "server-only";

import { z } from "zod";

const supabaseEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const supabaseServiceRoleSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export type SupabaseEnv = z.infer<typeof supabaseEnvSchema>;

export type SupabaseEnvStatus = {
  configured: boolean;
  missingKeys: Array<keyof SupabaseEnv>;
  env: SupabaseEnv | null;
};

export function getSupabaseEnvStatus(): SupabaseEnvStatus {
  const input = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  const result = supabaseEnvSchema.safeParse(input);

  if (result.success) {
    return {
      configured: true,
      missingKeys: [],
      env: result.data,
    };
  }

  const missingKeys = Object.entries(input)
    .filter(([, value]) => !value)
    .map(([key]) => key as keyof SupabaseEnv);

  return {
    configured: false,
    missingKeys,
    env: null,
  };
}

export function requireSupabaseEnv() {
  const { env } = getSupabaseEnvStatus();

  if (!env) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  return env;
}

export function requireSupabaseServiceRoleKey() {
  const result = supabaseServiceRoleSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  if (!result.success) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  return result.data.SUPABASE_SERVICE_ROLE_KEY;
}
