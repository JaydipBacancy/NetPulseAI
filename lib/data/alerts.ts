import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AlertsFeedData, AlertsFilters, AlertsSortBy, SortOrder } from "@/types/alerts";
import type { Database } from "@/types/supabase";

type NodeRow = Pick<
  Database["public"]["Tables"]["network_nodes"]["Row"],
  "id" | "name" | "network_slice" | "status"
>;

type AlertRow = Pick<
  Database["public"]["Tables"]["network_alerts"]["Row"],
  "current_value" | "id" | "metric_type" | "node_id" | "severity" | "status" | "summary" | "threshold_value" | "title" | "triggered_at"
>;

type QueryResponse<T> = {
  data: T | null;
  error: { message: string } | null;
};

const severityRank: Record<Database["public"]["Enums"]["alert_severity_enum"], number> = {
  critical: 3,
  info: 1,
  warning: 2,
};

function unwrapQuery<T>(response: QueryResponse<T>, context: string): T {
  if (response.error || response.data === null) {
    throw new Error(`Alerts query failed for ${context}.`);
  }

  return response.data;
}

function createNodeContextHref(node: NodeRow) {
  const params = new URLSearchParams({
    slice: node.network_slice,
    status: node.status,
  });

  return `/nodes?${params.toString()}`;
}

function createStatusCounts(): AlertsFeedData["countsByStatus"] {
  return {
    open: 0,
    resolved: 0,
  };
}

function compareStrings(a: string, b: string, sortOrder: SortOrder) {
  const result = a.localeCompare(b);
  return sortOrder === "asc" ? result : -result;
}

function compareNumbers(a: number, b: number, sortOrder: SortOrder) {
  const result = a - b;
  return sortOrder === "asc" ? result : -result;
}

function sortAlerts(
  alerts: AlertsFeedData["alerts"],
  sortBy: AlertsSortBy,
  sortOrder: SortOrder,
) {
  const sortedAlerts = [...alerts];

  sortedAlerts.sort((a, b) => {
    switch (sortBy) {
      case "title":
        return compareStrings(a.title, b.title, sortOrder);
      case "severity":
        return compareNumbers(
          severityRank[a.severity],
          severityRank[b.severity],
          sortOrder,
        );
      case "current_value":
        return compareNumbers(a.currentValue, b.currentValue, sortOrder);
      case "created_at":
      default:
        return compareNumbers(
          new Date(a.createdAt).getTime(),
          new Date(b.createdAt).getTime(),
          sortOrder,
        );
    }
  });

  return sortedAlerts;
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

function toUniqueSorted<T extends string>(values: T[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

export async function getAlertsFeedData(filters: AlertsFilters): Promise<AlertsFeedData> {
  const supabase = await createSupabaseServerClient();
  const [alertsResponse, nodesResponse] = await Promise.all([
    supabase
      .from("network_alerts")
      .select(
        "id,node_id,metric_type,severity,status,title,summary,current_value,threshold_value,triggered_at",
      )
      .order("triggered_at", { ascending: false })
      .limit(1500),
    supabase.from("network_nodes").select("id,name,network_slice,status"),
  ]);

  const alerts = unwrapQuery<AlertRow[]>(alertsResponse, "alerts");
  const nodes = unwrapQuery<NodeRow[]>(nodesResponse, "nodes");
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const countsByStatus = createStatusCounts();
  const normalizedQuery = filters.query?.trim().toLowerCase();

  for (const alert of alerts) {
    countsByStatus[alert.status] += 1;
  }

  const mappedAlerts = alerts.map((alert) => {
    const node = nodeById.get(alert.node_id);

    return {
      createdAt: alert.triggered_at,
      currentValue: alert.current_value,
      id: alert.id,
      metricType: alert.metric_type,
      nodeContextHref: node ? createNodeContextHref(node) : "/nodes",
      nodeId: alert.node_id,
      nodeName: node?.name ?? "Unknown node",
      severity: alert.severity,
      status: alert.status,
      summary: alert.summary,
      thresholdValue: alert.threshold_value,
      title: alert.title,
    };
  });

  const filteredAlerts = mappedAlerts.filter((alert) => {
    const matchesStatus = alert.status === filters.status;
    const matchesSeverity = filters.severity ? alert.severity === filters.severity : true;
    const matchesMetricType = filters.metricType
      ? alert.metricType === filters.metricType
      : true;
    const matchesQuery = normalizedQuery
      ? [alert.title, alert.summary, alert.nodeName]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      : true;

    return matchesStatus && matchesSeverity && matchesMetricType && matchesQuery;
  });

  const sortedAlerts = sortAlerts(filteredAlerts, filters.sortBy, filters.sortOrder);
  const totalItems = sortedAlerts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / filters.pageSize));
  const page = normalizePage(filters.page, totalPages);
  const start = (page - 1) * filters.pageSize;
  const paginatedAlerts = sortedAlerts.slice(start, start + filters.pageSize);

  return {
    alerts: paginatedAlerts,
    countsByStatus,
    filters: {
      ...filters,
      page,
    },
    options: {
      metricTypes: toUniqueSorted(mappedAlerts.map((alert) => alert.metricType)),
      nodes: nodes.map((node) => ({ id: node.id, name: node.name })),
    },
    pagination: {
      page,
      pageSize: filters.pageSize,
      totalItems,
      totalPages,
    },
  };
}
