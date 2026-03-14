type PhaseOneReadinessInput = {
  supabaseConfigured: boolean;
};

export function getPhaseOneReadinessSummary({
  supabaseConfigured,
}: PhaseOneReadinessInput) {
  if (supabaseConfigured) {
    return "Phase 1 is complete. The project scaffold, validation layer, feedback system, and Supabase-ready backend utilities are in place.";
  }

  return "Phase 1 is complete at the code level. Add the Supabase public environment variables to activate authenticated backend flows in later phases.";
}
