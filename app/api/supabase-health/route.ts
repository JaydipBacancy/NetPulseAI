import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/supabase";

const tableNames = [
  "network_nodes",
  "network_metrics",
  "network_alerts",
  "test_cases",
  "test_results",
  "analysis_reports",
] as const satisfies ReadonlyArray<keyof Database["public"]["Tables"]>;

type TableCountResult = {
  table: (typeof tableNames)[number];
  count?: number;
  error?: string;
  ok: boolean;
};

async function getTableCount(
  table: (typeof tableNames)[number],
): Promise<TableCountResult> {
  const supabase = createSupabaseAdminClient();
  const { count, error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true });

  if (error) {
    return {
      table,
      error: error.message,
      ok: false,
    };
  }

  return {
    table,
    count: count ?? 0,
    ok: true,
  };
}

export async function GET() {
  try {
    const results = await Promise.all(tableNames.map((table) => getTableCount(table)));
    const failed = results.filter((result) => !result.ok);

    return NextResponse.json(
      {
        status: failed.length === 0 ? "ok" : "error",
        message:
          failed.length === 0
            ? "Supabase connection, schema, and seed data look healthy."
            : "Supabase responded, but one or more table checks failed.",
        results,
      },
      {
        status: failed.length === 0 ? 200 : 500,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to connect to Supabase.",
      },
      {
        status: 500,
      },
    );
  }
}
