import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;
type MetricType = Database["public"]["Enums"]["metric_type_enum"];

type CreateMetricSampleInput = {
  metricType: MetricType;
  metricValue: number;
  nodeId: string;
  recordedAt: string;
  thresholdValue: number;
};

type CreateMetricSampleResult =
  | { metricId: string; ok: true }
  | { errorMessage: string; ok: false };

const metricUnitByType: Record<MetricType, string> = {
  jitter_ms: "ms",
  latency_ms: "ms",
  packet_loss_pct: "%",
  throughput_mbps: "Mbps",
};

export async function createMetricSampleForAlert(
  supabase: SupabaseServerClient,
  input: CreateMetricSampleInput,
): Promise<CreateMetricSampleResult> {
  const { data, error } = await supabase
    .from("network_metrics")
    .insert({
      metric_type: input.metricType,
      metric_value: input.metricValue,
      node_id: input.nodeId,
      recorded_at: input.recordedAt,
      threshold_value: input.thresholdValue,
      unit: metricUnitByType[input.metricType],
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      errorMessage: "Unable to create a metric sample for this alert.",
      ok: false,
    };
  }

  return {
    metricId: data.id,
    ok: true,
  };
}
