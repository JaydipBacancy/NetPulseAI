import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseEnv, requireSupabaseServiceRoleKey } from "@/lib/supabase/env";
import type { Database } from "@/types/supabase";

let adminClient: SupabaseClient<Database> | undefined;

export function createSupabaseAdminClient() {
  const { NEXT_PUBLIC_SUPABASE_URL } = requireSupabaseEnv();
  const serviceRoleKey = requireSupabaseServiceRoleKey();

  adminClient ??= createClient<Database>(
    NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  return adminClient;
}
