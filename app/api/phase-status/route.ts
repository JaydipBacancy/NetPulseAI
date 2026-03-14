import { NextResponse } from "next/server";
import { getPhaseOneReadinessSummary } from "@/lib/analysis/phase-one";
import { phaseOneDependencies, phaseOneStack } from "@/lib/data/phase-one";
import { getSupabaseEnvStatus } from "@/lib/supabase/env";

export async function GET() {
  const supabase = getSupabaseEnvStatus();

  return NextResponse.json({
    name: "Phase 1 - Project Setup",
    phase: 1,
    status: "complete",
    dependencies: phaseOneDependencies,
    stack: phaseOneStack,
    serverAction: "app/actions/phase-one.ts",
    routeHandler: "/api/phase-status",
    summary: getPhaseOneReadinessSummary({
      supabaseConfigured: supabase.configured,
    }),
    supabase,
  });
}
