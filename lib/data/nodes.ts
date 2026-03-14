import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  NodesFilters,
  NodesInventoryData,
  NodesSortBy,
  SortOrder,
} from "@/types/nodes";
import type { Database } from "@/types/supabase";

type NodeRow = Pick<
  Database["public"]["Tables"]["network_nodes"]["Row"],
  "availability_pct" | "id" | "name" | "network_slice" | "region" | "site_code" | "status" | "vendor"
>;

type MetricRow = Pick<
  Database["public"]["Tables"]["network_metrics"]["Row"],
  "metric_type" | "metric_value" | "node_id" | "recorded_at"
>;

type QueryResponse<T> = {
  data: T | null;
  error: { message: string } | null;
};

const nodeStatusOrder: Database["public"]["Enums"]["node_status_enum"][] = [
  "online",
  "degraded",
  "offline",
  "maintenance",
];

function unwrapQuery<T>(response: QueryResponse<T>, context: string): T {
  if (response.error || response.data === null) {
    throw new Error(`Nodes query failed for ${context}.`);
  }

  return response.data;
}

function roundValue(value: number, decimals: number) {
  const precision = 10 ** decimals;
  return Math.round(value * precision) / precision;
}

function compareStrings(a: string, b: string, sortOrder: SortOrder) {
  const result = a.localeCompare(b);
  return sortOrder === "asc" ? result : -result;
}

function compareNumbers(a: number | null, b: number | null, sortOrder: SortOrder) {
  if (a === null && b === null) {
    return 0;
  }

  if (a === null) {
    return 1;
  }

  if (b === null) {
    return -1;
  }

  const result = a - b;
  return sortOrder === "asc" ? result : -result;
}

function getLatestMetricByNodeAndType(metrics: MetricRow[]) {
  const latestMetricMap = new Map<string, MetricRow>();

  for (const metric of metrics) {
    const key = `${metric.node_id}:${metric.metric_type}`;

    if (!latestMetricMap.has(key)) {
      latestMetricMap.set(key, metric);
    }
  }

  return latestMetricMap;
}

function toUniqueSorted(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function getMetricValue(
  metrics: Map<string, MetricRow>,
  nodeId: string,
  metricType: MetricRow["metric_type"],
  precision: number,
) {
  const metric = metrics.get(`${nodeId}:${metricType}`);

  if (!metric) {
    return null;
  }

  return roundValue(metric.metric_value, precision);
}

function getAvailableStatuses(nodes: NodeRow[]) {
  const statusSet = new Set(nodes.map((node) => node.status));
  return nodeStatusOrder.filter((status) => statusSet.has(status));
}

function sortRows(
  rows: NodesInventoryData["rows"],
  sortBy: NodesSortBy,
  sortOrder: SortOrder,
) {
  const sortedRows = [...rows];

  sortedRows.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return compareStrings(a.name, b.name, sortOrder);
      case "vendor":
        return compareStrings(a.vendor, b.vendor, sortOrder);
      case "status":
        return compareStrings(a.status, b.status, sortOrder);
      case "region":
        return compareStrings(a.region, b.region, sortOrder);
      case "network_slice":
        return compareStrings(a.networkSlice, b.networkSlice, sortOrder);
      case "latency_ms":
        return compareNumbers(a.latencyMs, b.latencyMs, sortOrder);
      case "throughput_mbps":
        return compareNumbers(a.throughputMbps, b.throughputMbps, sortOrder);
      case "packet_loss_pct":
        return compareNumbers(a.packetLossPct, b.packetLossPct, sortOrder);
      case "jitter_ms":
        return compareNumbers(a.jitterMs, b.jitterMs, sortOrder);
      default:
        return 0;
    }
  });

  return sortedRows;
}

function normalizePage(page: number, totalPages: number) {
  if (page < 1) {
    return 1;
  }

  if (page > totalPages) {
    return totalPages;
  }

  return page;
}

export async function getNodesInventoryData(
  filters: NodesFilters,
): Promise<NodesInventoryData> {
  const supabase = await createSupabaseServerClient();
  const [nodesResponse, metricsResponse] = await Promise.all([
    supabase
      .from("network_nodes")
      .select("id,site_code,name,region,vendor,network_slice,status,availability_pct"),
    supabase
      .from("network_metrics")
      .select("node_id,metric_type,metric_value,recorded_at")
      .order("recorded_at", { ascending: false })
      .limit(2000),
  ]);

  const nodes = unwrapQuery<NodeRow[]>(nodesResponse, "nodes");
  const metrics = unwrapQuery<MetricRow[]>(metricsResponse, "metrics");
  const latestMetrics = getLatestMetricByNodeAndType(metrics);
  const normalizedQuery = filters.query?.trim().toLowerCase();

  const allRows = nodes.map((node) => ({
    availabilityPct: node.availability_pct,
    id: node.id,
    jitterMs: getMetricValue(latestMetrics, node.id, "jitter_ms", 1),
    latencyMs: getMetricValue(latestMetrics, node.id, "latency_ms", 1),
    name: node.name,
    networkSlice: node.network_slice,
    packetLossPct: getMetricValue(latestMetrics, node.id, "packet_loss_pct", 2),
    region: node.region,
    siteCode: node.site_code,
    status: node.status,
    throughputMbps: getMetricValue(latestMetrics, node.id, "throughput_mbps", 0),
    vendor: node.vendor,
  }));

  const filteredRows = allRows.filter((row) => {
    const matchesVendor = filters.vendor ? row.vendor === filters.vendor : true;
    const matchesSlice = filters.networkSlice
      ? row.networkSlice === filters.networkSlice
      : true;
    const matchesStatus = filters.status ? row.status === filters.status : true;
    const matchesQuery = normalizedQuery
      ? [
          row.name,
          row.networkSlice,
          row.region,
          row.siteCode,
          row.vendor,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      : true;

    return matchesVendor && matchesSlice && matchesStatus && matchesQuery;
  });

  const sortedRows = sortRows(filteredRows, filters.sortBy, filters.sortOrder);
  const totalItems = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / filters.pageSize));
  const page = normalizePage(filters.page, totalPages);
  const start = (page - 1) * filters.pageSize;
  const rows = sortedRows.slice(start, start + filters.pageSize);

  return {
    filters: {
      ...filters,
      page,
    },
    options: {
      networkSlices: toUniqueSorted(allRows.map((row) => row.networkSlice)),
      statuses: getAvailableStatuses(nodes),
      vendors: toUniqueSorted(allRows.map((row) => row.vendor)),
    },
    pagination: {
      page,
      pageSize: filters.pageSize,
      totalItems,
      totalPages,
    },
    rows,
  };
}
