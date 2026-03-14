import type { Database } from "@/types/supabase";

export type NodeStatus = Database["public"]["Enums"]["node_status_enum"];
export type SortOrder = "asc" | "desc";
export type NodesSortBy =
  | "jitter_ms"
  | "latency_ms"
  | "name"
  | "network_slice"
  | "packet_loss_pct"
  | "region"
  | "status"
  | "throughput_mbps"
  | "vendor";

export type NodesFilters = {
  page: number;
  pageSize: number;
  query?: string;
  networkSlice?: string;
  sortBy: NodesSortBy;
  sortOrder: SortOrder;
  status?: NodeStatus;
  vendor?: string;
};

export type NodeInventoryRow = {
  availabilityPct: number;
  id: string;
  jitterMs: number | null;
  latencyMs: number | null;
  name: string;
  networkSlice: string;
  packetLossPct: number | null;
  region: string;
  siteCode: string;
  status: NodeStatus;
  throughputMbps: number | null;
  vendor: string;
};

export type NodeFilterOptions = {
  networkSlices: string[];
  statuses: NodeStatus[];
  vendors: string[];
};

export type NodesPagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

type BaseNodeFormState<FieldName extends string> = {
  fieldErrors: Partial<Record<FieldName, string[]>>;
  message: string;
  status: "idle" | "server_error" | "success" | "validation_error";
  submittedAt?: string;
  values: Partial<Record<FieldName, string>>;
};

export type CreateNodeFieldName =
  | "availabilityPct"
  | "name"
  | "networkSlice"
  | "nodeType"
  | "region"
  | "siteCode"
  | "softwareVersion"
  | "status"
  | "vendor";

export type CreateNodeFormState = BaseNodeFormState<CreateNodeFieldName>;

export type NodesInventoryData = {
  filters: NodesFilters;
  options: NodeFilterOptions;
  pagination: NodesPagination;
  rows: NodeInventoryRow[];
};